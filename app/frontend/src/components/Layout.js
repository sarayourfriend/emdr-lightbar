import React from 'react';
import { View } from '@wp-g2/components';

export default function Layout({ children }) {
    return (
        <View css={{ width: '500px', margin: 'auto' }}>
            {children}
        </View>
    );
}
