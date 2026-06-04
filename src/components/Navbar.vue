<template>
  <nav class="main-navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-icon">A</div>
          <span class="brand-text">Activity</span>
        </router-link>
      </div>

      <div class="navbar-links">
        <router-link class="nav-link" to="/">
          <span class="link-text">Home</span>
        </router-link>
        <router-link class="nav-link" to="/transaction">
          <span class="link-text">Transaction</span>
        </router-link>
         <router-link class="nav-link" to="/dashboard">
           <span class="link-text">Dashboard</span>
         </router-link>
         <router-link class="nav-link" to="/budget">
           <span class="link-text">Budget</span>
         </router-link>
         <router-link class="nav-link" to="/edit">
           <span class="link-text">Edit</span>
         </router-link>

      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.main-navbar {
  background-color: white;
  border-bottom: 1px solid var(--light-border);
  height: 72px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand .brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.navbar-brand .brand-link:hover {
  opacity: 0.8;
}

.brand-icon {
  background-color: var(--dark-color-opposite-one);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color-opposite-one);
  letter-spacing: -0.025em;
}

.navbar-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--dark-color);
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
}

.nav-link:hover {
  background-color: var(--light-color-opposite-two);
  color: var(--dark-color-opposite-one);
}

.nav-link.router-link-active {
  background-color: var(--light-color-opposite-two);
  color: var(--dark-color-opposite-one);
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }

  .navbar-container {
    padding: 0 1rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
