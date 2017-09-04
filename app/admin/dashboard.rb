ActiveAdmin.register_page "Dashboard" do

  menu priority: 1, label: proc{ I18n.t("active_admin.dashboard") }

  content title: proc{ I18n.t("active_admin.dashboard") } do
    # div class: "blank_slate_container", id: "dashboard_default_message" do
    #   span class: "blank_slate" do
    #     span I18n.t("active_admin.dashboard_welcome.welcome")
    #     small I18n.t("active_admin.dashboard_welcome.call_to_action")
    #   end
    # end

    columns do
      column do
        # cheap tactic to get centering :shrugs:
        h2 ""
      end
      column do
        h2 do
          text_node image_tag "https://www.quizdb.org/quizdb.png", size: "64x56"
          text_node "Welcome to QuizDB: Admin!"
        end
      end
      column do;end
    end

    div do
      columns do
        column do
          h2 ""
        end
        column do
          h4 "If this is your first time here, try viewing the various datasets from the links in the navbar up top."
          h5 "If you're an admin, check out the tables below for a quick summary of the latest activity in QuizDB."
        end
        column do
          ""
        end
      end
    end

    TABLE_LIMIT = 10

    columns do
      column span: 2 do
        panel "Most recent errors" do
          table_for Error.all.order(updated_at: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column :error_type
            column(:description) {|q| q.description.truncate(50)}
            column(:question) {|q| link_to("#{q.errorable_type} #{q.errorable_id}", q.errorable)}
            column :updated_at
          end
        end
      end

      column do
        panel "Tossups with most errors" do
          table_for Tossup.all.order(errors_count: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column :errors_count
          end
        end
      end

      column do
        panel "Bonuses with most errors" do
          table_for Bonus.all.order(errors_count: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column :errors_count
          end
        end
      end

    end

    columns do
      column do
        panel "Most recent tossup changes" do
          table_for Tossup.all.order(updated_at: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column(:text) {|q| q.formatted_text.html_safe.truncate(30)}
            column(:answer) {|q| q.formatted_answer.html_safe.truncate(30)}
            column :updated_at
          end
        end
      end
      column do
        panel "Most recent bonus changes" do
          table_for Bonus.all.order(updated_at: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column(:content) {|q| q.html_content.truncate(30)}
            column :updated_at
          end
        end
      end
      column do
        panel "Most recent tournament changes" do
          table_for Tournament.all.order(updated_at: :desc).limit(TABLE_LIMIT) do
            column(:id) {|q| link_to(q.id, q)}
            column :year
            column(:name) {|q| q.name.truncate(30)}
            column :updated_at
          end
        end
      end

    end

  end
end
