module QuillHelper
  THEME = 'snow'
  VERSION = '1.1.3'
  def quill_generator(form, field, &block)
    modules = {
      toolbar: [
        ['bold', 'italic', 'underline']
      ]
    }
    object_name = form.object.class.name.downcase
    id = "#{object_name}_#{field}_ql"
    html_options = {
      id: id,
      style: "background: white;"
    }

    # have to do this bullshit because arbre context ruins use of asset tag helpers
    ("<link rel='stylesheet' media='screen' href='//cdn.quilljs.com/1.1.3/quill.#{THEME}.css'>" +
    "<script src='//cdn.quilljs.com/#{VERSION}/quill.min.js'></script>" +

    "<div id='#{id}' style='#{html_options[:style]}'></div>" +

    "<script>var quill_#{id} = new Quill('##{id}', {
         modules: #{modules.to_json},
         theme: '#{THEME}'
    });</script>" +

    "<script>$(document).ready(function() {
      quill_#{id}.pasteHTML($('##{object_name}_#{field}').val());
      quill_#{id}.on('text-change', function() {
        $('##{object_name}_#{field}').val($('##{id} .ql-editor').html());
      })
    });</script>").html_safe


    # but honestly, this isn't that much prettier either
    # should just be using partials :sigh:
    # stylesheet_link_tag("//cdn.quilljs.com/#{VERSION}/quill.#{THEME}.css") +
    # javascript_include_tag("//cdn.quilljs.com/#{VERSION}/quill.min.js") +
    # content_tag(:div, capture(&block), html_options, escape: false) +
    # javascript_tag("var quill_#{id} = new Quill('##{id}', {
    #     modules: #{modules.to_json},
    #     theme: '#{THEME}'
    # });") +
    # javascript_tag("$(document).ready(function() {
    #   quill_#{id}.pasteHTML($('##{object_name}_#{field}').val());
    #   quill_#{id}.on('text-change', function() {
    #     $('##{object_name}_#{field}').val($('##{id} .ql-editor').html());
    #   })
    # });")

    # $('form#new_#{object_name}').submit(function(e) {
    # $('##{object_name}_#{field}').val($('##{id} .ql-editor').html());
    # });

    # $('##{id} .ql-editor').change(function() {
    #   console.log('test');
    #   $('##{object_name}_#{field}').val($(this).html());
    # });

  end
end
