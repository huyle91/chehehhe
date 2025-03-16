export const roleModules = [
  {
    module: "User",
    apiPermissions: [
        {
          name: "Craete User",
          method: "POST",
          url: "v1/user",
        },
        {
          name: "Get User",
          method: "GET",
          url: "v1/user?current=?&pageSize=?",
        },
        {
          name: "Get user with id", 
          method: "POST",
          url: "v1/user/:id",
        },
        {
          name: "Update user",
          method: "PATCH",
          url: "v1/dish/:id",
        },
        {
          name: "Delete user",
          method: "DELETE",       
          url: "v1/user/:id",
        },
        {
          name: "Update password user",
          method: "PATCH",
          url: "v1/user/update-password/:id",
        },
      ],
  },
   {
    module: "Permission",
    apiPermissions: [
      {
        name: "Create permission",
        method: "POST",
        url: "v1/permission",
      },
      {
        name: "Get permission",
        method: "GET",
        url: "v1/permission?current=?&pageSize=?",
      },
      {
        name: "Get permission with id", 
        method: "POST",
        url: "v1/permission/:id",
      },
      {
        name: "Update permission",
        method: "PATCH",
        url: "v1/permission/:id",
      },
      {
        name: "Delete permission",
        method: "DELETE",       
        url: "v1/permission/:id",
      },
    ],
  },
 {
    module: "Role",
    apiPermissions: [
      {
        name: "Create role",
        method: "POST",
        url: "v1/role",
      },
      {
        name: "Get role",
        method: "GET",
        url: "v1/role?current=?&pageSize=?",
      },
      {
        name: "Get role with id", 
        method: "POST",
        url: "v1/role/:id",
      },
      {
        name: "Update role",
        method: "PATCH",
        url: "v1/role/:id",
      },
      {
        name: "Delete role",
        method: "DELETE",       
        url: "v1/role/:id",
      },
    ],
  },
  {
    module: "Files",
    apiPermissions: [
      {
        name: "Upfile",
        method: "POST",
        url: "v1/files/upload/avatar",
      },
    ],
  },
  {
    module: "Category",
    apiPermissions: [
        {
          name: "Create category",
          method: "POST",
          url: "v1/category",
        },
        {
          name: "Get category",
          method: "GET",
          url: "v1/category?current=?&pageSize=?",
        },
        {
          name: "Get category with id", 
          method: "POST",
          url: "v1/category/:id",
        },
        {
          name: "Update category",
          method: "PATCH",
          url: "v1/category/:id",
        },
        {
          name: "Delete category",
          method: "DELETE",       
          url: "v1/category/:id",
        },
      ],
  },
  {
    module: "Dish",
    apiPermissions: [
        {
          name: "Create dish",
          method: "POST",
          url: "v1/dish",
        },
        {
          name: "Get dish",
          method: "GET",
          url: "v1/category?current=?&pageSize=?",
        },
        {
          name: "Get dish with id", 
          method: "POST",
          url: "v1/dish/:id",
        },
        {
          name: "Update dish",
          method: "PATCH",
          url: "v1/dish/:id",
        },
        {
          name: "Delete dish",
          method: "DELETE",       
          url: "v1/dish/:id",
        },
      ],
  }, 
  {
    module: "Table Order",
    apiPermissions: [
        {
          name: "Create table-order",
          method: "POST",
          url: "v1/table-order",
        },
        {
          name: "Get table-order",
          method: "GET",
          url: "v1/category?current=?&pageSize=?",
        },
        {
          name: "Get table-order with id", 
          method: "POST",
          url: "v1/table-order/:id",
        },
        {
          name: "Update table-order",
          method: "PATCH",
          url: "v1/table-order/:id",
        },
        {
          name: "Delete table-order",
          method: "DELETE",       
          url: "v1/table-order/:id",
        },
      ],
  },
  {
    module: "Table",
    apiPermissions: [
        {
          name: "Create table",
          method: "POST",
          url: "v1/table",
        },
        {
          name: "Get table-order",
          method: "GET",
          url: "v1/table?current=?&pageSize=?",
        },
        {
          name: "Get table-order with id", 
          method: "POST",
          url: "v1/table/:id",
        },
        {
          name: "Update table-order",
          method: "PATCH",
          url: "v1/table/:id",
        },
        {
          name: "Delete table",
          method: "DELETE",       
          url: "v1/table/:id",
        },
      ],
  },
];
