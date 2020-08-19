(function () {
    const MovementDirections = {
        right: 'right',
        left: 'left',

        opposite( md ) {
            if ( md === this.left ) {
                return this.right;
            }
            return this.left;
        }
    }

    const minMarginLeft = 0;

    const defaultModel = {
        isStarted: false,
        isStopping: false,
        stoppingBounceCount: false,
        lightWidth: 2,
        speed: 1000,
        leftPosition: 50,
        maxLeftPosition: 98,
        movementDirection: MovementDirections.right
    };

    const reverseMovementDirection = ( model ) => {
        const nextMovementDirection =
            MovementDirections.opposite( model.movementDirection );
        const nextStoppingBounceCount =
            model.isStopping
                ? model.stoppingBounceCount + 1
                : model.stoppingBounceCount;
        
        return {
            ...model,
            movementDirection: nextMovementDirection,
            stoppingBounceCount: nextStoppingBounceCount,
        };
    };

    const bounceLeftSide = ( nextLeftPosition, model ) =>
        reverseMovementDirection( {
            ...model,
            leftPosition: Math.abs( nextLeftPosition )
        } );

    const moveLeft = ( pctDelta, model ) => {
        const nextLeftPosition =
            model.leftPosition - pctDelta;
        
        if ( nextLeftPosition < minMarginLeft ) {
            return bounceLeftSide( nextLeftPosition, model );
        }
        return { ...model, leftPosition: nextLeftPosition };
    }

    const bounceRightSide = ( nextLeftPosition, model ) =>
        reverseMovementDirection( {
            ...model,
            leftPosition: model.maxLeftPosition - ( nextLeftPosition - model.maxLeftPosition ),
        } );

    const moveRight = ( pctDelta, model ) => {
        const nextLeftPosition =
            model.leftPosition + pctDelta;
        
        if ( nextLeftPosition > model.maxLeftPosition ) {
            return bounceRightSide( nextLeftPosition, model );
        }
        return { ...model, leftPosition: nextLeftPosition };
    }

    const within = ( x, l, u ) => l < x && x < u;

    const positionNearMiddle = ( model ) => {
        const midpoint = model.maxLeftPosition / 2;
        const tolerance = model.maxLeftPosition * 0.02;
        const lowerBound = midpoint - tolerance;
        const upperBound = midpoint + tolerance;

        return within( model.leftPosition, lowerBound, upperBound );
    }

    const shouldStopStopping = ( model ) =>
        model.isStopping && model.stoppingBounceCount == 2 && positionNearMiddle( model );

    const stopStopping = ( model ) => {
        if ( model.onStop ) {
            model.onStop();
        }

        return ( {
            ...model,
            isStarted: false,
            isStopping: false,
            stoppingBounceCount: 0,
        } );
    };

    const updateLeftPosition = ( delta, model ) => {
        const pctDelta =
            delta * ( model.maxLeftPosition / model.speed );

        const movedModel =
            model.movementDirection === MovementDirections.right
                ? moveRight( pctDelta, model )
                : moveLeft( pctDelta, model );
        
        return shouldStopStopping( movedModel )
            ? stopStopping( movedModel )
            : movedModel;
    };

    const startBouncing = ( model ) => ( {
        ...model,
        isStarted: true,
        isStopping: false,
        stoppingBounceCount: 0
    } );

    const stopBouncing = ( model, onStop ) => ( {
        ...model,
        isStarted: false,
        isStopping: true,
        stoppingBounceCount: 0,
        onStop,
    } );

    const doUpdateWidth = ( width, model ) => {
        const nextMaxLeftPosition =
            100 - width;
        
        const nextLeftPosition =
            model.leftPosition > nextMaxLeftPosition
                ? nextMaxLeftPosition
                : model.leftPosition;
        
        return {
            ...model,
            lightWidth: width,
            leftPosition: nextLeftPosition,
            maxLeftPosition: nextMaxLeftPosition,
        };
    }

    window.Lightbar = class Lightbar {
        constructor( rootElement, initialModel ) {
            this.rootElement = rootElement;
            this.model = Object.assign( defaultModel, initialModel );
            this.render();
        }

        setVisible( visible, onStop ) {
            this.visible = visible;
            if ( visible ) {
                this.rootElement.style.display = 'flex';
            } else {
                this.stopBounce( onStop );
                this.rootElement.style.display = 'none';
            }
        }

        updateSettings( newSettings ) {
            const nextModel = {
                ...this.model,
                ...newSettings,
            };

            this.reRender();

            if ( nextModel.isStarted !== this.model.isStarted ) {
                if ( nextModel.isStarted ) {
                    this.model = startBouncing( nextModel );
                    this.beginAnimation();
                } else {
                    this.model = stopBouncing( nextModel );
                    // animation will automatically stop
                }
            }
        }

        stopBounce( onStop ) {
            this.model = stopBouncing( this.model, onStop );
            // re-render just in case
            this.reRender();
        }

        startBounce() {
            this.model = startBouncing( this.model );
            this.beginAnimation();
        }

        updateLightWidth( nextWidth ) {
            this.model = doUpdateWidth( nextWidth, this.model );
        }

        updateLightSpeed( nextSpeed ) {
            this.model.speed = nextSpeed;
        }

        isBouncing() {
            return this.model.isStarted;
        }

        beginAnimation() {
            let prevTs = null;
            const animate = ( ts ) => {
                if ( ! ( this.model.isStarted || this.model.isStopping ) ) {
                    return;
                }
                if ( prevTs === null ) {
                    prevTs = ts;
                }

                const delta = ts - prevTs;
                this.model = updateLeftPosition( delta, this.model );
                this.reRender();
                prevTs = ts;
                window.requestAnimationFrame( animate );
            }
            window.requestAnimationFrame( animate );
        }

        render() {
            this.lightbarElement = document.getElementById( 'lightbar' );
            this.lightElement = document.getElementById( 'light' );
        }

        reRender() {
            this.lightElement.style.width = this.model.lightWidth + '%';
            this.lightElement.style.marginLeft = this.model.leftPosition + '%';
        }

        toJSON() {
            return {
                type: 'lightbar',
                isStarted: this.model.isStarted,
                speed: this.model.speed,
                lightWidth: this.model.lightWidth,
                isStopping: this.model.isStopping,
                stoppingBounceCount: this.model.stoppingBounceCount,
            }
        }
    }
})();
