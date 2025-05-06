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
  categories: string[];
  disabled?: boolean;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
  categories,
  disabled = false,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Label htmlFor="category-select" className="text-lg font-medium text-primary">Choose a Category:</Label>
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
        disabled={disabled}
        name="category-select"
        
      >
        <SelectTrigger className="w-[200px] bg-card text-card-foreground border-primary focus:ring-primary" id="category-select">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
