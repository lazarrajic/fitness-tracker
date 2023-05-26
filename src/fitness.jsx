import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./fitness.css";
import { AiOutlinePlus } from "react-icons/ai";

const firebaseConfig = {
  apiKey: "AIzaSyDvoB-2PrGZN6a-Ey5S1Iqc0YYYNTrlf9g",
  authDomain: "fitnesstracker-97ef1.firebaseapp.com",
  databaseURL: "https://fitnesstracker-97ef1-default-rtdb.firebaseio.com/",
  projectId: "fitnesstracker-97ef1",
  storageBucket: "fitnesstracker-97ef1.appspot.com",
  messagingSenderId: "603814647241",
  appId: "1:603814647241:web:9b6f6d05eea5f2d9168418",
  measurementId: "G-DBJNBNM60T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Fitness = () => {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [personalBest, setPersonalBest] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [showNewExerciseInput, setShowNewExerciseInput] = useState(false);

  const [program, setProgram] = useState("5x5");
  const [startingWeight, setStartingWeight] = useState(0);
  const [workouts, setWorkouts] = useState([]);

  const [squatStartingWeight, setSquatStartingWeight] = useState(0);
  const [benchPressStartingWeight, setBenchPressStartingWeight] = useState(0);
  const [barbellRowStartingWeight, setBarbellRowStartingWeight] = useState(0);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User is signed in
        // You can retrieve the user's data using result.user

        // Retrieve data from the database
        const progressDataRef = ref(database, "progressData");
        onValue(progressDataRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setProgressData(data);
          }
        });
      })
      .catch((error) => {
        // Handle errors here
      });
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Reset state variables
        setExercise("");
        setWeight("");
        setPersonalBest({});
        setProgressData([]);
      })
      .catch((error) => {
        // Handle errors here
      });
  };

  const strongLifts5x5 = (startingWeight, weeks) => {
    const workouts = [];
    let currentSquatWeight = Number(squatStartingWeight);
    let currentBenchPressWeight = Number(benchPressStartingWeight);
    let currentBarbellRowWeight = Number(barbellRowStartingWeight);

    for (let i = 0; i < weeks; i++) {
      // Workout A
      workouts.push({
        squat: { sets: 5, reps: 5, weight: currentSquatWeight },
        benchPress: { sets: 5, reps: 5, weight: currentBenchPressWeight },
        barbellRow: { sets: 5, reps: 5, weight: currentBarbellRowWeight },
      });

      // Increase weight by 2.5kg
      currentSquatWeight += 2.5;
      currentBenchPressWeight += 2.5;
      currentBarbellRowWeight += 2.5;

      // Workout B
      // workouts.push({
      //   squat: { sets: 5, reps: 5, weight: squatStartingWeight },
      //   overheadPress: { sets: 5, reps: 5, weight: currentWeight },
      //   deadlift: { sets: 1, reps: 5, weight: currentWeight },
      // });

      // // Increase weight by 2.5kg
      // currentWeight += 2.5;
    }

    return workouts;
  };

  const smolovJr = (exercise, startingWeight, weeks) => {
    const workouts = [];
    let currentWeight = Number(startingWeight);

    for (let i = 0; i < weeks; i++) {
      // Week 1
      workouts.push({
        [exercise]: { sets: 6, reps: 6, weight: currentWeight },
      });
      workouts.push({
        [exercise]: { sets: 7, reps: 5, weight: currentWeight + 2.5 },
      });
      workouts.push({
        [exercise]: { sets: 8, reps: 4, weight: currentWeight + 5 },
      });
      workouts.push({
        [exercise]: { sets: 10, reps: 3, weight: currentWeight + 7.5 },
      });

      // Increase weight by 10kg
      currentWeight += 10;

      // Week 2
      workouts.push({
        [exercise]: { sets: 6, reps: 6, weight: currentWeight },
      });
      workouts.push({
        [exercise]: { sets: 7, reps: 5, weight: currentWeight + 2.5 },
      });
      workouts.push({
        [exercise]: { sets: 8, reps: 4, weight: currentWeight + 5 },
      });
      workouts.push({
        [exercise]: { sets: 10, reps: 3, weight: currentWeight + 7.5 },
      });

      // Increase weight by 15kg
      currentWeight += 15;

      // Week 3
      workouts.push({
        [exercise]: { sets: 6, reps: 6, weight: currentWeight },
      });
      workouts.push({
        [exercise]: { sets: 7, reps: 5, weight: currentWeight + 2.5 },
      });
      workouts.push({
        [exercise]: { sets: 8, reps: 4, weight: currentWeight + 5 },
      });
      workouts.push({
        [exercise]: { sets: 10, reps: 3, weight: currentWeight + 7.5 },
      });

      // Increase weight by another increment for next cycle
      if (i < weeks - 1) {
        currentWeight += startingWeight;
      }
    }

    return workouts;
  };

  const handleSquatStartingWeightChange = (event) => {
    setSquatStartingWeight(event.target.value);
  };

  const handleBenchPressStartingWeightChange = (event) => {
    setBenchPressStartingWeight(event.target.value);
  };

  const handleBarbellRowStartingWeightChange = (event) => {
    setBarbellRowStartingWeight(event.target.value);
  };

  const handleProgramChange = (event) => {
    setProgram(event.target.value);
  };

  const handleStartingWeightChange = (event) => {
    setStartingWeight(event.target.value);
  };

  const handleProgramFormSubmit = (event) => {
    event.preventDefault();

    // Generate workouts based on selected program
    let generatedWorkouts;
    if (program === "5x5") {
      generatedWorkouts = strongLifts5x5(startingWeight, 12);
    } else if (program === "smolovJr") {
      generatedWorkouts = smolovJr("squat", startingWeight, 3);
    }

    setWorkouts(generatedWorkouts);
  };

  // Get a reference to the database service
  const database = getDatabase(app);

  const handleDelete = (exercise, weightIndex) => {
    // Find the exercise to be updated
    const exerciseData = progressData.find(
      (data) => data.exercise === exercise
    );

    // Remove the specified weight entry
    const updatedWeights = exerciseData.weights.filter(
      (weight, index) => index !== weightIndex
    );

    // Update progress data
    const updatedProgressData = progressData.map((data) => {
      if (data.exercise === exercise) {
        return {
          ...data,
          weights: updatedWeights,
        };
      }
      return data;
    });

    // Save updated progress data to the database
    set(ref(database, "progressData"), updatedProgressData);
  };

  useEffect(() => {
    // Only retrieve data if a user is logged in
    if (auth.currentUser) {
      // Retrieve data from the database
      const progressDataRef = ref(database, "progressData");
      onValue(progressDataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProgressData(data);
        }
      });
    }
  }, [auth.currentUser]);

  const handleExerciseChange = (event) => {
    setExercise(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleNewExerciseChange = (event) => {
    setNewExercise(event.target.value);
  };

  const handleToggleNewExerciseInput = () => {
    setShowNewExerciseInput(
      (prevShowNewExerciseInput) => !prevShowNewExerciseInput
    );
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Update personal best weights
    if (personalBest.hasOwnProperty(exercise)) {
      if (weight > personalBest[exercise]) {
        setPersonalBest({ ...personalBest, [exercise]: weight });
      }
    } else {
      setPersonalBest({ ...personalBest, [exercise]: weight });
    }

    // Update progress data
    const existingExercise = progressData.find(
      (data) => data.exercise === exercise
    );

    let updatedProgressData;
    if (existingExercise) {
      updatedProgressData = progressData.map((data) => {
        if (data.exercise === exercise) {
          return {
            ...data,
            weights: [
              ...data.weights,
              { name: data.weights.length + 1, weight: weight },
            ],
          };
        }
        return data;
      });
    } else {
      updatedProgressData = [
        ...progressData,
        { exercise, weights: [{ name: 1, weight: weight }] },
      ];
    }

    // Save updated progress data to the database
    set(ref(database, "progressData"), updatedProgressData);

    // Reset input fields
    setExercise("");
    setWeight("");
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "montserrat subrayada",
          fontSize: "40px",
        }}
      >
        Fitness Tracker
      </h1>
      <div className="login-container">
        {auth.currentUser ? (
          <button className="sign-out-button" onClick={handleLogout}>
            Sign Out
          </button>
        ) : (
          <button className="sign-in-button" onClick={handleLogin}>
            Sign in with Google
          </button>
        )}
      </div>
      <div>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <label style={{ fontWeight: "600" }}>
            Select Exercise:
            <select
              style={{ marginLeft: "5px", padding: "5px" }}
              value={exercise}
              onChange={handleExerciseChange}
            >
              <option value=""> Select </option>
              <option value="Bench">Bench</option>
              <option value="Squat">Squat</option>
              <option value="Deadlift">Deadlift</option>
              {/* Add more exercise options */}
            </select>
          </label>

          <label style={{ fontWeight: "600" }}>
            Weight Used (in kg):
            <input
              style={{ marginLeft: "5px", padding: "5px" }}
              type="number"
              value={weight}
              onChange={handleWeightChange}
            />
          </label>

          <button
            style={{
              width: "75px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#d6d6d1",
              height: "30px",
            }}
            type="submit"
          >
            Save
          </button>
          <span
            style={{
              display: "flex",
              marginLeft: "5px",
              cursor: "pointer",
              alignItems: "center",
              gap: "5px",
              flexDirection: "column",
            }}
            onClick={handleToggleNewExerciseInput}
          >
            Add new Exercise <AiOutlinePlus />
          </span>

          {showNewExerciseInput && (
            <label style={{ fontWeight: "600" }}>
              New Exercise:
              <input
                style={{ marginLeft: "5px" }}
                type="text"
                value={newExercise}
                onChange={handleNewExerciseChange}
              />
            </label>
          )}
        </form>

        <select value={program} onChange={handleProgramChange}>
          <option value="">Select a program</option>
          <option value="5x5">StrongLifts 5x5</option>
          <option value="smolovJr">Smolov Jr.</option>
        </select>

        <form onSubmit={handleProgramFormSubmit}>
          {/* <label>
            Select Program:
            <select value={program} onChange={handleProgramChange}>
              <option value="">Select a program</option>
              <option value="5x5">StrongLifts 5x5</option>
              <option value="smolovJr">Smolov Jr.</option>
            </select>
          </label> */}

          {program === "5x5" && (
            <>
              <label>
                Squat Starting Weight (in kg):
                <input
                  type="number"
                  value={squatStartingWeight}
                  onChange={handleSquatStartingWeightChange}
                />
              </label>

              <label>
                Bench Press Starting Weight (in kg):
                <input
                  type="number"
                  value={benchPressStartingWeight}
                  onChange={handleBenchPressStartingWeightChange}
                />
              </label>

              <label>
                Barbell Row Starting Weight (in kg):
                <input
                  type="number"
                  value={barbellRowStartingWeight}
                  onChange={handleBarbellRowStartingWeightChange}
                />
              </label>
            </>
          )}

          {program === "smolovJr" && (
            <label>
              Starting Weight (in kg):
              <input
                type="number"
                value={startingWeight}
                onChange={handleStartingWeightChange}
              />
            </label>
          )}

          {program && <button type="submit">Generate Workouts</button>}
        </form>
      </div>{" "}
      {workouts.map((workout, index) => (
        <div key={index}>
          <h3>Workout {index + 1}</h3>
          {workout.squat && (
            <p>
              Squat: {workout.squat.sets} sets x {workout.squat.reps} reps @{" "}
              {workout.squat.weight} kg
            </p>
          )}
          {workout.benchPress && (
            <p>
              Bench Press: {workout.benchPress.sets} sets x{" "}
              {workout.benchPress.reps} reps @ {workout.benchPress.weight} kg
            </p>
          )}
          {workout.barbellRow && (
            <p>
              Barbell Row: {workout.barbellRow.sets} sets x{" "}
              {workout.barbellRow.reps} reps @ {workout.barbellRow.weight} kg
            </p>
          )}
        </div>
      ))}
      {/* Render video component here */}
      {auth.currentUser && (
        <>
          <h2>Progress</h2>

          {console.log(progressData)}
          {progressData && progressData.length > 0 ? (
            progressData.map((data, index) => (
              <div key={index}>
                <h3>{data.exercise}</h3>
                <div style={{ display: "flex" }}>
                  <div>
                    <LineChart width={600} height={300} data={data.weights}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 300]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                    </LineChart>
                  </div>
                  <ul>
                    {data.weights.map((weight, weightIndex) => (
                      <li key={weightIndex}>
                        Weight Entry {weightIndex + 1}: {weight.weight} kg
                        <button
                          onClick={() =>
                            handleDelete(data.exercise, weightIndex)
                          }
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </>
      )}
    </div>
  );
};

export default Fitness;
