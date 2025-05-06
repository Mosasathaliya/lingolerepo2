// src/components/CategorySelector.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: { english: string; arabic: string }[]; // Updated categories type
  disabled?: boolean;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
  categories,
  disabled = false,
}: CategorySelectorProps) {
  const getCategoryDisplay = (value: string) => {
    const category = categories.find(cat => cat.english === value);
    return category ? `${category.english} / ${category.arabic}` : value;
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Label htmlFor="category-select" className="text-lg font-medium text-primary text-center">
        Choose a Category: <br />
        <span className="font-[inherit]" dir="rtl">اختر فئة:</span>
      </Label>
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
        disabled={disabled}
        name="category-select"
      >
        <SelectTrigger
          className="w-[250px] sm:w-[300px] bg-card text-card-foreground border-primary focus:ring-primary"
          id="category-select"
        >
          {/* Display both English and Arabic for the selected value */}
          <SelectValue placeholder="Select category">
            {getCategoryDisplay(selectedCategory)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.english} value={category.english} className="font-[inherit]">
              {/* Display both English and Arabic in the dropdown */}
              {category.english} / <span className="float-right" dir="rtl">{category.arabic}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
