<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hico</title>
  <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
</head>
<body>
	<div id="app">
    <h1>Hello, Hico</h1>
    <p>use jQuery change text color</p>
    <p class="links">
      <a href="/course" target="_blank">course</a>
      <a href="/data" target="_blank">data</a>
      <a href="/forum" target="_blank">forum</a>
    </p>
  </div>
  <script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
	<script src="{{ config('view.static_resources_prefix') }}/dist/index.js"></script>
</body>
</html>