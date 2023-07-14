import Layout from "./src/Layout.vue";
import Sidebar from "./src/Sidebar.vue";
import Navbar from "./src/Navbar.vue";
import MenuItem from "./src/MenuItem.vue";
import type { RouteMeta } from "vue-router";
import type { RouteRecordName } from "vue-router";

export { Layout, Sidebar, Navbar, MenuItem };

export interface Breadcrumb {
  path: string;
  name: RouteRecordName | undefined;
  meta: RouteMeta;
}
