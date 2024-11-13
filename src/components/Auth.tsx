import { JSX, onMount } from "solid-js";
import { auth, setAuth } from "~/global";
import { db } from "./database";

export function Auth(props: { children?: JSX.Element }) {


    // const [profile, setProfile] = createSignal();

    onMount(() => {
        // const query = { members: {} };
        // console.log('query', query)
        // db.subscribeQuery(query, (
        //   result
        // ) => {
        //   console.log('result', result)
        // });

        db.subscribeAuth((auth) => {
            console.log('auth', auth)
            setAuth(auth);
        });


    })

    if (auth()) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {props.children}
        </>
    )
}
