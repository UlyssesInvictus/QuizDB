class AddConfirmableToAdminUser < ActiveRecord::Migration[5.0]
  def change
    add_column :admin_users, :confirmation_token, :string
    add_column :admin_users, :confirmed_at, :datetime
    add_column :admin_users, :confirmation_sent_at, :datetime
    add_column :admin_users, :unconfirmed_email, :string # For reconfirmable
    add_index :admin_users, :confirmation_token, unique: true
    # User.reset_column_information # Need for some types of updates, but not for update_all.
    # To avoid a short time window between running the migration and updating all existing
    # users as confirmed, do the following
    AdminUser.all.update_all confirmed_at: DateTime.now
    # All existing user accounts should be able to log in after this.
  end
end
