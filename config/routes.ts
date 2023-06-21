export default [
  {name: '接口列表', path: '/', icon: 'smile', component: './Index'},
  {name: '接口信息', path: '/interfaceInfo/:id', component: './InterfaceInfo', hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './User/Login'}],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {name: '接口管理', path: '/admin/interface_info', component: './Admin/InterfaceInfo'},
      {name: '接口分析', path: '/admin/analysis_interface', component: './Admin/AnalysisInterface'},
    ],
  },
  {name: '404', path: '*', layout: false, component: './404'},
];
