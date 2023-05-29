<script setup>
import { Navbar, NavbarLogo, NavbarCollapse, NavbarLink } from 'flowbite-vue'
import Logo from '@/assets/logo.png';
</script>
<template>
	<Navbar solid class="bg-gray-900 text-white">
      <template #logo>
        <NavbarLogo link="/" alt="IPO Inbox Logo" :image-url="Logo" />
      </template>
      <template #default="{isShowMenu}">
        <NavbarCollapse :isShowMenu="isShowMenu">
          <NavbarLink isActive link="#">Home</NavbarLink>
          <NavbarLink link="#">Services</NavbarLink>
          <NavbarLink link="#">Pricing</NavbarLink>
          <NavbarLink link="#">Contact</NavbarLink>
        </NavbarCollapse>
      </template>
    </Navbar>
</template>
