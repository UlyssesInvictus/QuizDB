namespace :questions do
  namespace :tossups do
    task :clean => :environment do
      counter = 0
      Tossup.all.each do |t|
        puts "Cleaning tossup #{counter}" if counter % 100 == 0
        original_text = t.text
        original_answer = t.answer
        text = original_text.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        formatted_text = t.formatted_text.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        answer = original_answer.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        formatted_answer = t.formatted_answer.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        attr_hash = {}
        if text != original_text
          attr_hash[:text] = text
          attr_hash[:formatted_text] = formatted_text
        end
        if answer != original_answer
          attr_hash[:answer] = answer
          attr_hash[:formatted_answer] = formatted_answer
        end
        if attr_hash.present?
          t.update(attr_hash)
        end
        counter += 1
      end
    end
  end

  namespace :bonuses do
    task :clean => :environment do
      counter = 0
      Bonus.all.includes(:bonus_parts).each do |t|
        puts "Cleaning bonus #{counter}" if counter % 100 == 0
        original_leadin = t.leadin
        leadin = original_leadin.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        formatted_leadin = t.formatted_leadin.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
        if leadin != original_leadin
          t.update(leadin: leadin, formatted_leadin: formatted_leadin)
        end

        t.bonus_parts.each do |b|
          original_text = b.text
          original_answer = b.answer
          text = original_text.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
          formatted_text = b.formatted_text.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
          answer = original_answer.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
          formatted_answer = b.formatted_answer.gsub("\\", "").gsub("\r\n", "").gsub("\n", "")
          attr_hash = {}
          if text != original_text
            attr_hash[:text] = text
            attr_hash[:formatted_text] = formatted_text
          end
          if answer != original_answer
            attr_hash[:answer] = answer
            attr_hash[:formatted_answer] = formatted_answer
          end
          if attr_hash.present?
            b.update(attr_hash)
          end
        end

        counter += 1
      end
    end
  end

end
