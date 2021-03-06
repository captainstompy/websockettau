$(function() {
  $(".new_game_form").submit(function(e) {
    var params = [
      { 'name' : 'training', 'value' : $("#training").is(':checked') },
      { 'name' : 'classic_cards', 'value' : $("#classic_cards").is(':checked') },
      { 'name' : 'colour_blind', 'value' : $("#colour_blind").is(':checked') }
    ];

    var that = $(this);
    $.each(params, function(i, param) {
        var input = $('<input/>').attr('type', 'hidden')
            .attr('name', param.name)
            .attr('value', param.value);
        that.append(input);
    });
    
    return true;
  });
});

$(function() {
  var start = (("" + window.location).indexOf("https") == 0) ? "wss" : "ws";
  console.log("Using " + start);
  var ws = new WebSocket(start + "://" + window.location.host + "/gamelistwebsocket/" + see_more_ended);

  ws.onopen = function() {
    ws.send(JSON.stringify({
        'type' : 'update'
    }));
  };

  function add_games(section, games) {
    section.find(".games_list").html('');
    if (games.length !== 0) {
      for (i in games) {
        var game_data = games[i];
        
        var players_string = "<span style=\"color:#ccc\">Empty</span>";
        if (game_data.players.length > 0) {
          players_string = game_data.players.join(", ");
        }

        var game_type = "Unknown game type";
        if (game_data.type === "3tau") {
          game_type = "3 Tau";
        } else if (game_data.type === "6tau") {
          game_type = "6 Tau";
        } else if (game_data.type === "g3tau") {
          game_type = "Generalized 3 Tau";
        } else if (game_data.type == "i3tau") {
          game_type = "Insane 3 Tau";
        } else if (game_data.type == "m3tau") {
          game_type = "Master 3 Tau";
        } else if (game_data.type == "e3tau") {
          game_type = "Easy 3 Tau";
        } else if (game_data.type == "4tau") {
          game_type = "4 Tau";
        } else if (game_data.type == "3ptau") {
          game_type = "3 Projective Tau";
        } else if (game_data.type == "z3tau") {
          game_type = "Puzzle 3 Tau";
        } else if (game_data.type == "4otau") {
          game_type = "4 Outer Tau";
        } else if (game_data.type == "n3tau") {
          game_type = "Near 3 Tau";
        } else if (game_data.type == "bqtau") {
          game_type = "Boolean Quadruple Tau";
        } else if (game_data.type == "sbqtau") {
          game_type = "Small Boolean Quadruple Tau";
        }
        
        section.find(".games_list").append($("<li><a href=\"/game/" + game_data.id + "\">Game " + game_data.id + "</a> (" + game_type + ") " + (game_data.training ? "(Training) " : "") + "- " + players_string + "</li>"));
      }
      section.show();
    } else {
      section.hide();
    }
  }

  ws.onmessage = function (e) {
    var data = JSON.parse(e.data);
    if (data.type == "players") {
      // TODO: Show players in lobby.
    } else if (data.type == "games") {
      add_games($("#newgames"), data.new_games);
      add_games($("#startedgames"), data.started_games);
      add_games($("#endedgames"), data.ended_games);
    }
  };

  ws.onclose = function() {
    $("body").prepend($("<span>DISCONNECTED - <a href=\"javascript:location.reload(true)\">REFRESH</a> (if you can't connect at all, <a href=\"" + window.location.href.replace("http:", "https:") + "\">try https</a> (ignore any warnings you see, my certificate is not good))</span>"));
    $("body").css("background-color", "red");
  };
});
