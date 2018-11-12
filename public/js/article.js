// Whenever someone clicks a p tag
$(document).on("click", "#article-item", function () {
    // Empty the notes from the note section
    $("#comment-container").empty();
    // Save the id from the p tag
    const thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/article/" + thisId
    })
        // With that done, add the comment information to the page
        .then(function (data) {
            $("comment-conatiner").append("<h1>Comments</h1>");
            for (let i = 0; i < data.length; i++) {
                $("#comment-container").append(`
                    <div class="comment-item">
                        <p>${data[i].comment} --${data[i].username} <span id=close-button data-id=${data[i].id}>Delete</span></p>
                        <hr>
                    </div`
                );
            }
            console.log(data);
            // An input to enter a new username
            $("#comment-container").append("<input id='username-input' name='username' >");
            // A textarea to add a new note body
            $("#comment-container").append("<textarea id='body-input' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comment-container").append("<button data-id='" + data._id + "' id='save-comment'>Save Comment</button>");
        });
});

// When you click the save-comment button
$(document).on("click", "#save-comment", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/article/" + thisId,
        data: {
            // Value taken from title input
            title: $("#username-input").val(),
            // Value taken from note textarea
            body: $("#body-input").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#comment-container").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#username-input").val("");
    $("#body-input").val("");
});