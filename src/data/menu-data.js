const menu_data = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    single_link: true,
    title: 'About',
    link: '/about',
  },
  {
    id: 3,
    capabilities: true,
    title: 'Capabilities',
    link: '/capabilities',
    capability_pages: [
      {
        title: 'Product Range',
        link: '/capabilities#products',
        icon: '🏭',
        description: 'Comprehensive fabric categories for diverse applications'
      },
      {
        title: 'Manufacturing Process',
        link: '/capabilities#process',
        icon: '⚙️',
        description: 'Step-by-step process ensuring quality at every stage'
      },
      {
        title: 'Machines & Technology',
        link: '/capabilities#machines',
        icon: '🔧',
        description: 'Advanced machinery for superior fabric production'
      },
      {
        title: 'Quality & Testing',
        link: '/capabilities#quality',
        icon: '🔬',
        description: 'Rigorous quality control at every stage of production'
      },
      {
        title: 'Certifications',
        link: '/capabilities#certifications',
        icon: '🏆',
        description: 'International certifications ensuring quality and sustainability'
      }
    ]
  },
  {
    id: 4,
    // products: true,
    single_link: true,
    title: 'Products',
    link: '/fabric',
    // product_pages: [
    //   {
    //     title: 'Shop Page',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Only Categories', link: '/shop-category' },
    //       { title: 'Shop Grid with Sideber', link: '/shop' },
    //       { title: 'Product Details', link: '/product-details' },
    //     ]
    //   },
    //   {
    //     title: 'Products',
    //     link: '/product-details',
    //     mega_menus: [
    //       { title: 'Product Simple', link: '/product-details' },
    //       { title: 'With Video', link: '/product-details-video' },
    //       { title: 'With Countdown Timer', link: '/product-details-countdown' },
    //       { title: 'Variations Swatches', link: '/product-details-swatches' },
    //     ]
    //   },
    //   {
    //     title: 'eCommerce',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Shopping Cart', link: '/cart' },
    //       { title: 'Compare', link: '/compare' },
    //       { title: 'Wishlist', link: '/wishlist' },
    //       { title: 'Checkout', link: '/checkout' },
    //       { title: 'My account', link: '/profile' },
    //     ]
    //   },
    //   {
    //     title: 'More Pages',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Login', link: '/login' },
    //       { title: 'Register', link: '/register' },
    //       { title: 'Forgot Password', link: '/forgot' },
    //       { title: '404 Error', link: '/404' },
    //     ]
    //   },
    // ]
  },
  // {
  //   id: 3,
  //   sub_menu: true,
  //   title: 'Shop',
  //   link: '/shop',
  //   sub_menus: [
  //     { title: 'Shop', link: '/shop' },
  //     { title: 'Right Sidebar', link: '/shop-right-sidebar' },
  //     { title: 'Hidden Sidebar', link: '/shop-hidden-sidebar' },
  //   ],
  // },
  // {
  //   id: 3,
  //   sub_menu: true,
  //   title: 'E-Commerce',
  //   link: '/cart',
  //   sub_menus: [
  //     { title: 'Shopping Cart', link: '/cart' },
  //     { title: 'Wishlist', link: '/wishlist' },
  //     { title: 'Checkout', link: '/checkout' },
  //     { title: 'My account', link: '/profile' },
  //   ],
  // },
  {
    id: 5,
    title: 'Blog',
    link: '/blog',
 /*    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Details', link: '/blog-details' },
    ] */
  },
  {
    id: 6,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    single_link: true,
    title: 'About',
    link: '/about',
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Capabilities',
    link: '/capabilities',
    sub_menus: [
      { title: 'Product Range', link: '/capabilities#products' },
      { title: 'Manufacturing Process', link: '/capabilities#process' },
      { title: 'Machines & Technology', link: '/capabilities#machines' },
      { title: 'Quality & Testing', link: '/capabilities#quality' },
      { title: 'Certifications', link: '/capabilities#certifications' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Products',
    link: '/fabric',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'E-Commerce',
    link: '/cart',
    sub_menus: [
      { title: 'Shopping Cart', link: '/cart' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'My account', link: '/profile' },
    ],
  },
  {
    id: 6,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Details', link: '/blog-details' },
    ]
  },
  {
    id: 7,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]
