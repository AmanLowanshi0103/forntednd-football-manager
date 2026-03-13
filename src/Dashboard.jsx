import { useEffect, useState } from "react"
import axios from "axios"
import "./Dashboard.css"

export default function Dashboard() {

  const [fixtures, setFixtures] = useState([])
  const [standings, setStandings] = useState([])
  const [team, setTeams] = useState([])
  const [week, setWeek] = useState(1)

  const API = "http://localhost:8000"

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    loadFixtures()
    loadStandings()

  }, [week])

  const loadTeams = async () => {
    const res = await axios.get(`${API}/teams`)
    console.log("teams", res.data)
    setTeams(res.data)
  }

  const loadFixtures = async () => {
    const res = await axios.get(`${API}/fixtures/fixtures`)
    console.log("fixtures", res.data)
    setFixtures(res.data)
  }

  const loadStandings = async () => {
    const res = await axios.get(`${API}/fixtures/table`)
    console.log(res.data)
    setStandings(res.data)
  }

  const simulateWeek = async () => {

    await axios.post(`${API}/fixtures/simulate/matchday/${week}`)

    loadFixtures()
    loadStandings()

    setWeek(week + 1)
  }

  function TeamName(id) {
    let teamName = team.filter((u) => u.id === id)
    return teamName[0].name
  }
  let showdata = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370]


  return (

    <div className="dashboard">

      {/* Sidebar */}

      <div className="sidebar">

        {fixtures.map((match, index) => (
          <div>
            {showdata.includes(index) && <h2>Matchday {match.matchday}</h2>}
            <div key={index} className="fixture">

              <span>{TeamName(match.home_team_id)}</span>

              <span className="score">
                {match.home_score ?? "-"} :
                {match.away_score ?? " -"}
              </span>

              <span>{TeamName(match.away_team_id)}</span>

            </div>
          </div>
        ))}

      </div>


      {/* Main Content */}

      <div className="main">

        <div className="header">

          <h1>League Table</h1>

          <button onClick={simulateWeek}>
            Simulate Week
          </button>

        </div>


        <table className="league-table">

          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>Pts</th>
            </tr>
          </thead>

          <tbody>

            {standings
              .sort((a, b) =>
                b.points - a.points ||
                (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against) ||
                b.goals_for - a.goals_for
              )
              .map((team, index) => (

                <tr key={team.team_id}>
                  <td>{index + 1}</td>
                  <td>{TeamName(team.team_id)}</td>
                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td>{team.goals_for}</td>
                  <td>{team.goals_against}</td>
                  <td>{team.points}</td>
                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}