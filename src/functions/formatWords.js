function formatTitle(str) {
    return str
        .toLowerCase() // Convert the entire string to lowercase
        .split(" ") // Split the string into an array of words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(" "); // Join the words back together into a single string
}

function formatTheme(str) {
    return (
        str
            .toLowerCase() // Convert the entire string to lowercase
            .charAt(0)
            .toUpperCase() + str.slice(1)
    ); // Capitalize the first letter of the sentence
}

module.exports = { formatTitle, formatTheme };
