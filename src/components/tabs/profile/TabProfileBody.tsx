import { tx } from "@instantdb/core";
import {
  BsEnvelopeAtFill,
  BsGearFill,
  BsIncognito,
  BsPencilFill,
  BsPenFill,
  BsTelephoneFill,
  BsX,
  BsXLg,
} from "solid-icons/bs";
import { createEffect, createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { db, Profile } from "~/components/database";
import { profile, user } from "~/global";
import { Dialog } from "@kobalte/core/dialog";
import { createStore } from "solid-js/store";

const [flow, setFlow] = createSignal<
  "no_profile" | "email" | "code" | "profile"
>("no_profile");
const [email, setEmail] = createSignal("");
const [code, setCode] = createSignal("");

function NoProfile() {
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
        <BsIncognito class="w-24 h-24 text-neutral-500" />
        <div class="font-medium text-lg">
          You are currently logged in as an anonymous user.
        </div>

        <div class="c-description">
          You can still use the app and interact with others, but your data will
          be lost unless you sign up or login.
        </div>

        <div class="flex space-x-2 items-center">
          <button
            class="button-sm"
            onClick={() => {
              setFlow("email");
            }}
          >
            Sign up
          </button>
          <button
            class="button-sm"
            onClick={() => {
              setFlow("email");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function RequireCode() {
  const [error, setError] = createSignal("");
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
        <div class="c-description">
          Check your email {email()} for a 6-digit code.
        </div>

        <Show when={error()}>
          <div class="c-description !text-red-500">{error()}</div>
        </Show>

        <div class="v-el border shadow-lg rounded-lg overflow-hidden">
          <input
            value={code()}
            onInput={(e) => {
              setCode(e.currentTarget.value);
            }}
            placeholder="XXXXXX"
            class="outline-none  
            min-w-0 
            px-4 py-2
            placeholder-neutral-500
            text-sm caret-neutral-500 bg-transparent"
          />
        </div>

        <button
          disabled={!code()}
          class="button-sm"
          onClick={async () => {
            try {
              const _email = email();
              if (!_email) return;
              const _code = code();
              if (!_code) return;

              const _signin = await db.auth.signInWithMagicCode({
                email: _email,
                code: _code,
              });
              if (_signin.user) {
                console.log("_signin", _signin);

                const { data } = await db.queryOnce({
                  profiles: {
                    $: {
                      where: {
                        id: _signin.user.id,
                      },
                    },
                  },
                });

                if (data.profiles[0]) {
                  // Already have profile, no-op
                  console.log("already have profile", data.profiles[0]);
                } else {
                  const result = await db.transact([
                    tx.profiles[_signin.user.id].update({
                      name: "Test User",
                      avatar_url: "",
                      // Create one phone number by default
                      contacts: [
                        {
                          type: "mobile",
                          value: "",
                        },
                      ],
                      description: "",
                      role: "Product Manager",
                    }),
                  ]);
                  console.log("created profile result", result);
                }
              }
            } catch (e) {
              console.error(e);
              setError("Error: Invalid code");
            } finally {
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function RequireEmail() {
  const [error, setError] = createSignal("");
  return (
    <div class="flex flex-col items-center justify-center h-full ">
      <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">
        {/* <BsIncognito class="w-24 h-24 text-neutral-500" />
  <div class="font-medium text-lg">
    Verify your email
  </div> */}

        <div class="c-description">
          Enter your email to receive a one-time pass code
        </div>

        <Show when={error()}>
          <div class="c-description !text-red-500">{error()}</div>
        </Show>

        <div class="v-el border shadow-lg rounded-lg overflow-hidden">
          <input
            value={email()}
            onInput={(e) => {
              setEmail(e.currentTarget.value);
            }}
            placeholder="Email"
            class="outline-none  
        min-w-0 
        px-4 py-2
        placeholder-neutral-500
        text-sm caret-neutral-500 bg-transparent"
          />
        </div>

        <button
          disabled={!email()}
          class="button-sm"
          onClick={async () => {
            try {
              const _email = email();
              if (!_email) return;
              await db.auth.sendMagicCode({ email: _email });
              setFlow("code");
            } catch (e) {
              console.error(e);
              setError("Error: Invalid email");
            } finally {
            }
          }}
        >
          Send Code
        </button>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const [store, setStore] = createStore<Partial<Profile>>({});

  createEffect(() => {
    const p = profile();
    setStore(p ?? {});
  });

  const [open, setOpen] = createSignal(false);

  return (
    <Show when={user()}>
      {(_user) => (
        <Show when={profile()}>
          {(_profile) => (
            <>
              <Dialog open={open()} onOpenChange={setOpen}>
                <Dialog.Portal>
                  <Dialog.Overlay class="dialog__overlay" />
                  <div class="dialog__positioner">
                    <Dialog.Content class="dialog__content">
                      <div class="p-4 space-y-6">
                        <div class="dialog__header">
                          <Dialog.Title class="font-bold text-xl">
                            Edit your profile
                          </Dialog.Title>
                        </div>

                        <div
                          class="overflow-auto space-y-6"
                          style={{
                            "max-height": "calc(100vh - 200px)",
                            "scrollbar-width": "thin",
                            "scrollbar-color": "#333 transparent",
                          }}
                        >
                          <div class="space-y-2">
                            <div class="font-medium">Name</div>
                            <input
                              value={store.name}
                              onInput={(e) => {
                                setStore("name", e.target.value);
                              }}
                              class="form-input"
                            />
                          </div>

                          <div class="space-y-2">
                            <div class="font-medium">Role</div>
                            <input
                              value={store.role}
                              onInput={(e) => {
                                setStore("role", e.target.value);
                              }}
                              class="form-input"
                            />
                          </div>

                          <For each={store.contacts}>
                            {(c, i) => (
                              <div class="space-y-2">
                                <div class="font-medium">Phone number</div>
                                <input
                                  value={c.value}
                                  onInput={(e) => {
                                    setStore(
                                      "contacts",
                                      i(),
                                      "value",
                                      e.target.value
                                    );
                                  }}
                                  class="form-input"
                                />
                              </div>
                            )}
                          </For>
                        </div>
                      </div>

                      <div class="p-4 bg-neutral-950 flex flex-row-reverse items-center space-x-2 space-x-reverse">
                        <button
                          onClick={async () => {
                            const result = await db.transact([
                              tx.profiles[_user().id].update(store),
                            ]);
                            console.log("update profile result", result);
                            setOpen(false);
                          }}
                          class="button-sm-inverted"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setOpen(false)}
                          class="button-sm flex-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Content>
                  </div>
                </Dialog.Portal>
              </Dialog>

              <div class="flex-1">
                <div class="bg-neutral-800 h-48"></div>

                <div class="px-6 pb-6 -translate-y-6 space-y-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-40 h-40 rounded-lg  border overflow-hidden">
                      <img src="/avatar.jpg" class="min-w-full min-h-full" />
                    </div>

                    <div class="space-y-2">
                      <div class="space-y-0.5">
                        <div class="font-bold text-2xl">{_profile().name}</div>
                        <div class="c-description">{_profile().role}</div>
                      </div>

                      <div class="flex items-center space-x-2">
                        <button
                          class="button-sm flex items-center space-x-1.5"
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <BsPencilFill class="w-3 h-3" />
                          <div>Edit Profile</div>
                        </button>
                        <button
                          class="button-sm"
                          onClick={() => db.auth.signOut()}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 bg-neutral-900 rounded-lg space-y-2">
                    <div class="font-bold">Contact information</div>

                    <div class="flex items-start space-x-4">
                      <div class="p-2 bg-neutral-800 border rounded">
                        <BsEnvelopeAtFill class="w-6 h-6 text-neutral-500" />
                      </div>
                      <div>
                        <div class="text-sm text-neutral-400">Email</div>
                        <div>{_user().email}</div>
                      </div>
                    </div>

                    <For each={_profile().contacts}>
                      {(c) => (
                        <div class="flex items-start space-x-4">
                          <div class="p-2 bg-neutral-800 border rounded">
                            <BsTelephoneFill class="w-6 h-6 text-neutral-500" />
                          </div>
                          <div>
                            <div class="text-sm text-neutral-400">
                              Phone number
                            </div>
                            <Show
                              fallback={<div class="c-description">N/A</div>}
                              when={c.value}
                            >
                              {(v) => <div>{v()}</div>}
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </>
          )}
        </Show>
      )}
    </Show>
  );
}

export default function TabProfileBody() {
  createEffect(() => {
    const _flow = flow();
    if (_flow === "profile") {
      setEmail("");
      setCode("");
    }
  });

  createEffect(() => {
    const _profile = profile();
    if (_profile) {
      setFlow("profile");
    } else {
      setFlow("no_profile");
    }
  });

  const components = {
    no_profile: NoProfile,
    email: RequireEmail,
    code: RequireCode,
    profile: ProfileSettings,
  };

  return <Dynamic component={components[flow()]} />;
}
