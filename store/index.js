import Vuex from "vuex";
import axios from "axios";
import Cookies from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },

    mutations: {
      setPosts(state, posts) {
        console.log("dare set meishe");
        state.loadedPosts = posts;
      },

      addPost(state, post) {
        state.loadedPosts.push(post);
      },

      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      },

      setToken(state, token) {
        state.token = token;
      },

      clearToken(state) {
        state.token = null;
      },
    },

    actions: {
      async nuxtServerInit(vueContext, context) {
        return axios
          .get(
            "https://react-redux-e4bc0-default-rtdb.europe-west1.firebasedatabase.app/posts.json"
          )
          .then((res) => {
            // console.log(res.data)
            const postsArray = [];
            for (const key in res.data) {
              postsArray.push({ ...res.data[key], id: key });
            }
            vueContext.commit("setPosts", postsArray);
          })
          .catch((e) => context.error(e));
      },

      setPosts(context, posts) {
        console.log("dare set meishe");

        context.commit("setPosts", posts);
      },

      addPost(vueContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date(),
        };
        return axios
          .post(
            "https://react-redux-e4bc0-default-rtdb.europe-west1.firebasedatabase.app/posts.json?auth=" +
              vueContext.state.token,
            createdPost
          )
          .then((result) => {
            console.log(result);
            vueContext.commit("addPost", {
              ...createdPost,
              id: result.data.name,
            });
          })
          .catch((e) => console.log(e));
      },

      editPost(vueContext, editedPost) {
        return axios
          .put(
            "https://react-redux-e4bc0-default-rtdb.europe-west1.firebasedatabase.app/posts/" +
              editedPost.id +
              ".json?auth=" +
              vueContext.state.token,
            editedPost
          )
          .then((res) => {
            console.log(res);
            console.log("edited post: " + editedPost);
            vueContext.commit("editPost", editedPost);
          })
          .catch((e) => console.log(e));
      },

      authenticateUser(vueContext, authData) {
        let authUrl =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB6koZuT3RDhC-gjLF-hFnZb0mf_WHf2Fc";
        if (!authData.isLogin) {
          authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB6koZuT3RDhC-gjLF-hFnZb0mf_WHf2Fc";
        }
        return axios
          .post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .then((result) => {
            console.log(result.data);
            vueContext.commit("setToken", result.data.idToken);
            localStorage.setItem("token", result.data.idToken);
            localStorage.setItem(
              "tokenExpiration",
              new Date().getTime() + result.data.expiresIn * 1000
            );
            Cookies.set("jwt", result.data.idToken);
            Cookies.set(
              "expirationDate",
              new Date().getTime() + result.data.expiresIn * 1000
            );
            vueContext.dispatch("setLogoutTimer", result.data.expiresIn * 1000);
          })
          .catch((e) => {
            console.log(e);
          });
      },

      setLogoutTimer(vueContext, duration) {
        setTimeout(() => {
          vueContext.commit("clearToken");
        }, duration);
      },

      initAuth(vueContext, req) {
        let token;
        let expirationDate;
        console.log('test')
        if (req) {
          if (!req.headers.cookie) {
            console.log('return1')
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("jwt="));
          if (!jwtCookie) {
            console.log('return1')
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("expirationDate="))
            .split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");

          if (new Date().getTime() > +expirationDate || !token) {
            vueContext.dispatch("logout");
            return;
          }
        }
        vueContext.dispatch(
          "setLogoutTimer",
          +expirationDate - new Date().getTime()
        );
        vueContext.commit("setToken", token);
      },

      logout(vueContext) {
        vueContext.commit("clearToken");
        Cookies.remove("expirationDate");
        Cookies.remove("jwt");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      },
    },

    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },

      isAuthenticated(state) {
        return state.token != null;
      },
    },
  });
};

export default createStore;
