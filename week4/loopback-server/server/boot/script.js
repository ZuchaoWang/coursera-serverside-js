module.exports = function(app) {
  var MongoDB = app.dataSources.MongoDB;

  MongoDB.automigrate('Customer', function(err) {
    if (err) throw (err);
    var Customer = app.models.Customer;

    Customer.create([{
      username: 'Admin',
      email: 'admin@admin.com',
      password: '123456'
    }, {
      username: 'normal',
      email: 'normal@normal.com',
      password: '123456'
    }], function(err, users) {
      if (err) return cb(err);
      var Role = app.models.Role;
      var RoleMapping = app.models.RoleMapping;

      //create the admin role
      Role.create({
        name: 'admin'
      }, function(err, role) {
        if (err) cb(err);
        //make admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function(err, principal) {
          if (err) throw (err);
        });
      });
    });
  });

};
