// FlavorPreferencesContext.js
import React, { createContext, useState } from 'react';

export const FlavorPreferencesContext = createContext();

export const FlavorPreferencesProvider = ({ children }) => {
    const [isChecked, setIsChecked] = useState({
        tastePreferences: {
            savory: false, 
            sweet: false, 
            salty: false, 
            spicy: false,
            bitter: false, 
            sour: false, 
            cool: false, 
            hot: false
        },
        allergies: {
            vegan: false, 
            vegetarian: false, 
            peanut: false, 
            gluten: false, 
            fish: false,
            shellfish: false, 
            eggs: false, 
            soy: false, 
            dairy: false, 
            keto: false
        },
    });

    return (
        <FlavorPreferencesContext.Provider value={{ isChecked, setIsChecked }}>
            {children}
        </FlavorPreferencesContext.Provider>
    );
};
