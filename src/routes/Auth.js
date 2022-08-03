// import { authService } from "fBase";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import React, { useState } from "react";

// export default function Auth() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [newAccount, setNewAccount] = useState(true);

//   // 하나로 다중 컨트롤
//   const onChange = (e) => {
//     const {
//       target: { name, value },
//     } = e;
//     if (name === "email") {
//       setEmail(value);
//     } else if (name === "password") {
//       setPassword(value);
//     }
//   };

//   // 생성 시 promise 발생
//   const onSubmit = async (e) => {
//     e.preventTarget();
//     try {
//       let data;
//       const auth = getAuth();
//       if (newAccount) {
//         // create account
//         data = await createUserWithEmailAndPassword(auth, email, password);
//       } else {
//         // login
//         data = await signInWithEmailAndPassword(auth, email, password);
//       }
//       console.log(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div>
//       <form>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           required
//           value={email}
//           onChange={onChange}
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           required
//           value={password}
//           onChange={onChange}
//         />
//         <input type="submit" value={newAccount ? "create account" : "Login"} />
//       </form>
//       <div>
//         <button>Continue with Google</button>
//         <button>Continue with Github</button>
//       </div>
//     </div>
//   );
// }

import AuthForm from "components/AuthForm";
import { authService } from "fBase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";

export default function Auth() {
  // const [inputs, setInputs] = useState({
  //   email: "",
  //   password: "",
  // });
  // const [newAccount, setNewAccount] = useState(true);
  // const [error, setError] = useState("");

  // const { email, password } = inputs;
  // const toggleAccount = () => setNewAccount((prev) => !prev); // 현재 newAccount와 반대 행동 하기
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  // const onChange = (e) => {
  //   const { name, value } = e.target;
  //   setInputs({
  //     ...inputs,
  //     [name]: value,
  //   });
  // };
  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let data;
  //     const auth = getAuth();
  //     if (newAccount) {
  //       data = await createUserWithEmailAndPassword(auth, email, password);
  //     } else {
  //       data = await signInWithEmailAndPassword(auth, email, password);
  //     }
  //     console.log(data);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  return (
    <div>
      {/* * 병신새끼
      <form onSubmit={onSubmit}>
        <input
          name="email"
          value={inputs.email}
          type="email"
          placeholder="Email"
          onChange={onChange}
          required
        />
        <input
          name="password"
          value={inputs.password}
          type="password"
          placeholder="Password"
          onChange={onChange}
          required
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span> */}
      <AuthForm />
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
}
