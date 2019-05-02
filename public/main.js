const form = document.getElementById('vote-form');

// Form Submit Event
form.addEventListener('submit', e => {
  const choice = document.querySelector('input[name=os]:checked').value;
  const data = { os: choice };

  fetch('http://localhost:3000/poll', {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  e.preventDefault();
});

fetch('http://localhost:3000/poll')
  .then(res => res.json())
  .then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    const voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {}
    );

    let dataPoints = [
      { label: 'Windows', y: voteCounts.Windows },
      { label: 'MacOS', y: voteCounts.MacOS },
      { label: 'Linux', y: voteCounts.Linux },
      { label: 'Other', y: voteCounts.Other }
    ];

    const chartContainer = document.querySelector('#chartContainer');

    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
          text: `Total Votes: ${totalVotes}`
        },
        data: [
          {
            type: 'column',
            dataPoints
          }
        ]
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      let pusher = new Pusher('6c2650c378f249adb331', {
        cluster: 'us3',
        forceTLS: true
      });

      let channel = pusher.subscribe('os-poll');
      channel.bind('os-vote', function(data) {
        dataPoints = dataPoints.map(votes => {
          if (votes.label == data.os) {
            votes.y += data.points;
            return votes;
          } else {
            return votes;
          }
        });
        chart.render();
      });
    }
  });
