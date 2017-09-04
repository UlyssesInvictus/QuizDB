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

    stylesheet_link_tag("//cdn.quilljs.com/#{VERSION}/quill.#{THEME}.css") +

    content_tag(:div, capture(&block), html_options, escape: false) +
    javascript_include_tag("//cdn.quilljs.com/#{VERSION}/quill.min.js") +
    javascript_tag("var quill_#{id} = new Quill('##{id}', {
        modules: #{modules.to_json},
        theme: '#{THEME}'
    });") +
    javascript_tag("$(document).ready(function() {
      quill_#{id}.pasteHTML($('##{object_name}_#{field}').val());
      quill_#{id}.on('text-change', function() {
        $('##{object_name}_#{field}').val($('##{id} .ql-editor').html());
      })
    });")

    # $('form#new_#{object_name}').submit(function(e) {
    # $('##{object_name}_#{field}').val($('##{id} .ql-editor').html());
    # });

    # $('##{id} .ql-editor').change(function() {
    #   console.log('test');
    #   $('##{object_name}_#{field}').val($(this).html());
    # });


  end
end
