const jwt = require("jsonwebtoken");
try {
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdHN2Y3dmanN6aW9rbG53YnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NzI4MzEsImV4cCI6MjAzNjU0ODgzMX0.4lckL0t4m5oCNkxxV5mOFheefeyRNYinMMHDAtjRc-o";
    const decoded = jwt.decode(token, { complete: true });
    console.log(decoded);
} catch (error) {
    console.error("Error decoding token: ", error);
}
