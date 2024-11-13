import { BsEnvelopeAtFill, BsIncognito, BsTelephoneFill } from "solid-icons/bs";
import { createEffect, createSignal, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { db } from "~/components/database";
import { auth, user } from "~/global";

const [flow, setFlow] = createSignal<'no_profile' | 'email' | 'code' | 'profile'>('no_profile')
const [email, setEmail] = createSignal('')
const [code, setCode] = createSignal('')

function NoProfile() {

  return <div class="flex flex-col items-center justify-center h-full ">
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
        <button class="button-sm" onClick={() => {
          setFlow('email')
        }}>Sign up</button>
        <button class="button-sm" onClick={() => {
          setFlow('email')
        }}>Login</button>
      </div>
    </div>
  </div>

}

function RequireCode() {
  const [error, setError] = createSignal('')
  return <div class="flex flex-col items-center justify-center h-full ">
    <div class="text-center max-w-lg flex flex-col items-center space-y-2 ">

      <div class="c-description">
        Check your email {email()} for a 6-digit code.
      </div>

      <Show when={error()}>
        <div class="c-description !text-red-500">{error()}</div>
      </Show>

      <div class="v-el border shadow-lg rounded-lg overflow-hidden">
        <input

          value={code()} onInput={(e) => {
            setCode(e.currentTarget.value)
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

            const _signin = await db.auth.signInWithMagicCode({ email: _email, code: _code });
            if (_signin.user) {
              console.log('_signin', _signin)
              return true;
            }
          } catch (e) {
            console.error(e);
            setError('Error: Invalid code')
          } finally {

          }
        }}>Continue</button>

    </div>
  </div>
}

function RequireEmail() {
  const [error, setError] = createSignal('')
  return <div class="flex flex-col items-center justify-center h-full ">
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

          value={email()} onInput={(e) => {
            setEmail(e.currentTarget.value)
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
            setFlow('code')
          } catch (e) {
            console.error(e);
            setError('Error: Invalid email')
          } finally {

          }
        }}>Send Code</button>

    </div>
  </div>
}

function ProfileSettings() {
  const _user = user()
  if (!_user) {
    return <></>
  }

  return <div class="flex-1">
    <div class="bg-neutral-800 h-48">



    </div>

    <div class="px-6 pb-6 -translate-y-6 space-y-4">
      <div class="flex items-center space-x-4">
        <div class="w-40 h-40 rounded-lg  border overflow-hidden">
          <img src="/avatar.jpg" class="min-w-full min-h-full" />
        </div>

        <div class="space-y-2">
          <div class="space-y-0.5">
            <div class="font-bold text-2xl">Peter Doe</div>
            <div class="c-description">Product Designer</div>
          </div>

          <div class="flex items-center space-x-2">
            <button class="button-sm" onClick={() => db.auth.signOut()}>Sign Out</button>
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
            <div>{_user.email}</div>
          </div>
        </div>


        <div class="flex items-start space-x-4">
          <div class="p-2 bg-neutral-800 border rounded">
            <BsTelephoneFill class="w-6 h-6 text-neutral-500" />
          </div>
          <div>
            <div class="text-sm text-neutral-400">Primary phone number</div>
            <div>+1 (555) 555-5555</div>
          </div>
        </div>


      </div>


    </div>
  </div>
}

export default function TabProfileBody() {

  createEffect(() => {
    const _flow = flow();
    if (_flow === 'profile') {
      setEmail('')
      setCode('')
    }
  })

  createEffect(() => {
    const _auth = auth();
    if (_auth?.user) {
      setFlow('profile')
    } else {
      setFlow('no_profile')
    }
  })

  const components = {
    'no_profile': NoProfile,
    email: RequireEmail,
    code: RequireCode,
    profile: ProfileSettings
  }

  return <Dynamic component={components[flow()]} />

}
