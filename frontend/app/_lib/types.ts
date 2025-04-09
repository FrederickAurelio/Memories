import { IconType } from "react-icons";
import { JSX } from "react";

export type FetchResponse = {
  success: boolean;
  message: string;
  errors: Record<string, string>;
};

export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type SidebarLinkOptionType = {
  type: "link";
  name: string;
  href: string;
  icon: IconType;
  iconFill: IconType;
};
export type SidebarPopoverOptionType = {
  type: "popover";
  name: string;
  href: string;
  icon: IconType;
  iconFill: IconType;
  content: () => JSX.Element;
};

export type SidebarOptionType =
  | SidebarLinkOptionType
  | SidebarPopoverOptionType;
