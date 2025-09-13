export type SubmenuItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[]; // <-- add this line for nested submenus
};

export type HeaderItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[]; // top-level menu can also have submenus
};
