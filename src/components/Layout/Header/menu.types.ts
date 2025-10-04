// --------------------------------------
// 📁 File: src/components/Layout/Header/menu.types.ts
// --------------------------------------
export interface Badge {
    text: string;
    tone?: 'info' | 'success' | 'warning' | 'danger';
  }
  
  export interface MenuNode {
    label: string;
    href: string;
    description?: string;
    badge?: Badge;
    submenu?: MenuNode[]; // recursive
  }
  
  export type HeaderItem = MenuNode;
  export type SubmenuItem = MenuNode;