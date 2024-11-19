import { createSignal } from "solid-js";
import useOverlay from "./components/UseOverlay";
import { AuthResult } from "@instantdb/core/dist/module/clientTypes";
import { Profile } from "./components/database";
import { IconTypes } from "solid-icons";

export const bodyOverlay = useOverlay();
export const sw: () => Omit<ServiceWorker, "postMessage"> & {
  postMessage: (message: AppMessage) => void;
} = () => navigator.serviceWorker.controller!;

export const [auth, setAuth] = createSignal<AuthResult>();
// Make sure only used after user is logged in
export const user = () => auth()?.user;
export const [profile, setProfile] = createSignal<Profile>();

export type AppMessage = any;
// {
//     type: 'INSTALL_APP',
//     app_id: string,
//     index: string,
//     offline: boolean
// }

declare global {
  type ResolvePath = (relativePath: string) => string;

  type AppMeta = {
    id: string;
    name: string;
    description: string;
    readme: string;
    categories: string[];
    author_name: string;
    icon: IconTypes;
    backgroundColor: `#${string}`;
    index: string;
  };

  type Resource =
    | {
        as: "css";
        value: string;
      }
    | ({
        as: "js";
        value: string;
      } & (
        | {
            type: "text/javascript";
          }
        | {
            type: "module";
            specifier: string;
          }
      ));
  type Installation = {
    id: string;
    // TODO: Allow app icon to be images instead of functions (not serializable)
    meta: Omit<AppMeta, "icon">;
    disabled: boolean;
    resources: Resource[];
    body: string;
    can_update_automatically: boolean;
  };
}
