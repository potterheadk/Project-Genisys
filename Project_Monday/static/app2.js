// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the Project Monday link
    const projectMondayLink = document.getElementById('projectMondayLink');

    // Add click event listener to the Project Monday link
    projectMondayLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of the link
        playSong(); // Call the function to play the song
    });

    // Function to play the song
    function playSong() {
        // Assuming you have an audio element with id "projectMondaySong" defined in your HTML
        const song = document.getElementById('projectMondaySong');
        song.play(); // Play the song
    }
});
