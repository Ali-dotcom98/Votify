/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./views/**/*.html", "./views/**/*.js"],
  theme: {
    extend: {
      colors:{
        primary:'#FF6363',
        secondary:{
            100:'#E2E2D5',
            200:'#888883',
        },
        bookmark:
        {
          "Purple":"#5267DF",
          "red":"#FA5959",
          "blue":"#242A45",
          "grey":"#91914A2",
          "white":"#f7f7f7,"
        },
      },
      fontFamily:
      {
        body:['Nunito'],
        New:['Time'],
        Popins:["poppins","sans-srif"],
      },
      container:
      {
        center:true,
        padding: '1rem',
        screens:
        {
          lg:"1124px",
          xl:"1124px",
          "2xl":"1124px",
        },
      },

    },
  },
  plugins: [],
}


