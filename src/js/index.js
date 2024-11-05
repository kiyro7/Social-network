$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const form = $(this);
        const actionUrl = form.attr('action');
        const data = form.serialize();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: data,
            success: function(response) {
                alert('Data updated successfully!');
                location.reload();
            },
            error: function() {
                alert('An error occurred.');
            }
        });
    });
});
