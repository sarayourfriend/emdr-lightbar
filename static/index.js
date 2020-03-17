const minSpeed = 3000;
const maxSpeed = 100;
const data = {
  isStarted: false,
  speed: 1000,
  movementDirection: 'right',
  minMarginLeft: 0,
  maxMarginLeft: getMaxMarginLeft(),
};

function getMaxMarginLeft(lightBarElement, lightElement) {
  lightBarElement = lightBarElement || document.getElementById('lightbar');
  lightElement = lightElement || document.getElementById('light');

  const barWidth = lightBarElement.clientWidth;
  const lightWidth = lightElement.clientWidth;
  return barWidth - lightWidth;
}

function updateLightWidth(toWidth) {
  const lightElement = document.getElementById('light');
  
  lightElement.style.width = toWidth;
}

function handleLightWidthChange(value) {
  const percentage = parseInt(value) / 100;
  updateLightWidth((10 * percentage) + 'em');
}

function handleLightSpeedChange(value) {
  const percentage = parseInt(value) / 100;
  const newSpeed = ((maxSpeed - minSpeed) * percentage) + minSpeed;
  data.speed = newSpeed;
  console.log(newSpeed);
}

function startBounce(startButton) {
  data.isStarted = true;
  startButton.innerText = 'Stop';
  
  const lightBarElement = document.getElementById('lightbar');
  const lightElement = document.getElementById('light');
  
  function handleMoveLeft(currentMarginLeft, pxDelta) {
    const nextMarginLeft = currentMarginLeft - pxDelta;

    if (currentMarginLeft === data.minMarginLeft) {
      data.movementDirection = 'right';
      handleMoveRight(currentMarginLeft, pxDelta);
    } else if (nextMarginLeft < data.minMarginLeft) {
      /**
      the next required movement would move past the left-most
      boundary, so we need to split the difference. For example,
      if pxDelta is 3 and our currentMarginLeft looks like this:
      [-|----------]
      then we want to end up here
      [--|---------]
      because we spend 2 getting to the end and then would need to turn around
      
      if we don't do this then the edges of the lightbar will appear to lag
      
      Therefore, we can find the correct difference by getting the abs of nextMarginLeft;
      */
      const inBoundsMarginLeft = Math.abs(nextMarginLeft);
      lightElement.style.marginLeft = inBoundsMarginLeft + 'px';
      data.movementDirection = 'right';
    } else {
      lightElement.style.marginLeft = nextMarginLeft + 'px';
    }
  }

  function handleMoveRight(currentMarginLeft, pxDelta) {
    const nextMarginLeft = currentMarginLeft + pxDelta;

    if (currentMarginLeft === data.maxMarginLeft) {
      data.movementDirection = 'left';
      handleMoveLeft(currentMarginLeft, pxDelta);
    } else if (nextMarginLeft > data.maxMarginLeft) {
      /**
      the next required movement would move past the right-most
      boundary, so we need to split the difference. For example,
      if pxDelta is 3 and our currentMarginLeft looks like this:
      [---------|--]
      then we want to end up here
      [----------|-]
      because we spend 2 getting to the end and then would need to turn around
      
      if we don't do this then the edges of the lightbar will appear to lag
      
      Therefore, we can find the correct difference by subtracting max from our next and then subtracting that from the max. We also need to reverse the movement direction.
      */
      const inBoundsMarginLeft = data.maxMarginLeft - (nextMarginLeft - data.maxMarginLeft);
      lightElement.style.marginLeft = inBoundsMarginLeft + 'px';
      data.movementDirection = 'left';
    } else {
      lightElement.style.marginLeft = nextMarginLeft + 'px';
    }
  }
  
  let previous = null;
  function bounce(timestamp) {
    if (!previous) {
      previous = timestamp;
      window.requestAnimationFrame(bounce);
      return;
    }

    data.maxMarginLeft = getMaxMarginLeft(lightBarElement, lightElement);
    data.minMarginLeft = 0;
    const rateInMs = data.speed;
    const pxPerMs = data.maxMarginLeft / rateInMs;
    
    const timeDelta = timestamp - previous;
    const pxDelta = timeDelta * pxPerMs;
    const currentMarginLeft = lightElement.style.marginLeft;
    const parsedMarginLeft = currentMarginLeft !== '' ? parseInt(currentMarginLeft) : 0;
    
    switch (data.movementDirection) {
      case 'left':
        handleMoveLeft(
          parsedMarginLeft,
          pxDelta
        );
        break;
      case 'right':
        handleMoveRight(
          parsedMarginLeft,
          pxDelta
        );
        break;
    }
    
    if (data.isStarted) {
      previous = timestamp;
      window.requestAnimationFrame(bounce)
    } /* else animation has been stopped */
  }
  
  window.requestAnimationFrame(bounce);
}

function endBounce(startButton) {
  data.isStarted = false;
  startButton.innerText = 'Start';
}

function toggleBounce(startButton) {
  if (data.isStarted) {
    endBounce(startButton);
  } else {
    startBounce(startButton);
  }
}

(function init() {
  // use the browsers saved form data if it exists
  // handleLightSpeedChange(document.querySelector('[name="light-speed"]').value);
  // handleLightWidthChange(document.querySelector('[name="light-width"]').value);

  window.lb = new Lightbar(document.getElementById('light-container'));
//   const socket = io();
// 
//   socket.emit('therapist-connect');
})()
