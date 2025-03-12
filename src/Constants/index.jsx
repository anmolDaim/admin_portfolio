
import profileImg from "../assets/profile_img.jpg"

export const user = {
    name: 'Anmol',
    email: 'anmoldaim@gmail.com',
    imageUrl:{profileImg},
  }
  export const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: true }
  ]
  export const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ]