<template>
  <div class="nav-bar">
    <Navbar></Navbar>
  </div>
  <router-view />
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>

<style>
:root {
  --gray-border: #616161;
  --light-border: #dddddd;
  --text-black: #070707;
  --text-white: #eeeeee;
  --background: #a8b897;
  --normal-color: #e9f5dc;
  --light-color: #b4d68f;
  --dark-color: #667d4e;
  --normal-color-opposite-one: #836e86;
  --normal-color-opposite-two: #ccafa7;
  --light-color-opposite-one: #9d8f9f;
  --light-color-opposite-two: #f2dfda;
  --dark-color-opposite-one: #56395b;
  --dark-color-opposite-two: #8a6256;
  --shadow: var(--dark-color-opposite-two);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  /* ... */
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-black);
}

button {
  color: var(--light-color);
  font-weight: bold;
  background-color: var(--normal-color-opposite-one);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

form {
  width: 80%;
  min-width: 350px;
  margin: 0 auto;
  padding: 2%;
  border: 1px solid var(--gray-border);
  border-radius: 5px;
}

input,
select,
textarea {
  font-family: Helvetica, Arial, sans-serif;
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  margin-top: 5px;
  border: 1px solid var(--dark-color-opposite-one);
  border-radius: 3px;
}

label {
  display: block;
  width: 30%;
  min-width: 80px;
}

.title {
  font-size: 200%;
  font-weight: bold;
  margin-bottom: 4%;
  text-align: center;
  color: var(--dark-color-opposite-one);
}
</style>
