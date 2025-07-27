import React, { createContext, useState } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(["None", "Home", "School", "Shopping"]);

  const addCategory = (name) => {
    if (!categories.includes(name)) {
      setCategories([...categories, name]);
    }
  };

  const deleteCategory = (name) => {
    setCategories(categories.filter(cat => cat !== name));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
