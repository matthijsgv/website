import Calendar from "react-calendar";
import "../../style/Kalender.css";
import { FaHeart } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Moment from "moment";
import { KalenderModal } from "./KalenderModal";


const Kalender = () => {
  const [showDay, setShowDay] = useState(false);
  const [currentDay, setCurrentDay] = useState(Date());
  const [standjes, setStandjes] = useState([]);
  const [loadedMonth, setLoadedMonth] = useState([]);
  const [fetchedMonths, setFetchedMonths] = useState({});
  const [daysWithActivities, setDaysWithActivities] = useState(new Set());

  const fetchStandjes = async () => {
    await fetch("http://localhost:8080/api/kalender/positions", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => setStandjes(res));
  };

  const fetchMonthActions = async (year, month) => {
    const yearMonthString = year.toString() + "-" + month.toString();
    await fetch(
      `http://localhost:8080/api/kalender/actions?year=${year}&month=${month}`,
      {
        method: "GET",
      }
    )
      .then((x) => x.json())
      .then((res) => {
        setFetchedMonths((state) => {
          let temp = { ...state };
          temp[yearMonthString] = res;
          setDaysWithActivities(
            (state) => new Set([...state, ...Object.keys(res)])
          );
          return temp;
        });
      });
  };

  useEffect(() => {
    fetchStandjes();
  }, []);

  const retrieveDay = (date) => {
    const mom = Moment(date);
    const month = fetchedMonths[mom.year().toString() + "-" + (mom.month() + 1).toString()]
    const day = month[mom.format("YYYY-MM-DD")]
    console.log("Retrieving", date, month, day )
    return day;
  }



  const loadMonth = ({ year, month }) => {
    let yearMonthString = year.toString() + month.toString();
    if (loadedMonth.includes(yearMonthString)) return;

    fetchMonthActions(year, month);
    setLoadedMonth((state) => [...state, yearMonthString]);
  };

  const getMonthAndYearFromDate = (date) => {
    // eslint-disable-next-line no-sequences
    return { year: date.year(), month: date.month() + 1 };
  };

  useEffect(() => {
    loadThreeMonths(new Date());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("Loaded Months:", loadedMonth);
  }, [loadedMonth]);

  const loadThreeMonths = (date) => {
    let thisMonth = Moment(date);
    let prevMonth = Moment(date).subtract(1, "months");
    let nextMonth = Moment(date).add(1, "months");
    loadMonth(getMonthAndYearFromDate(prevMonth));
    loadMonth(getMonthAndYearFromDate(thisMonth));
    loadMonth(getMonthAndYearFromDate(nextMonth));
  };
  const kalRef = useRef();
  return (
    <div className="kalender_outer">
      <div className="kalender_inner">
        <Calendar
          minDetail="year"
          minDate={new Date("01-01-23")}
          ref={kalRef}
          showNeighboringMonth={true}
          showWeekNumbers={false}
          defaultView="month"
          onActiveStartDateChange={(e) => {
            if (e.action === "drillUp") return;
            loadThreeMonths(e.activeStartDate);
          }}
          onChange={(e) => {
            console.log("View changed. New view:", e);
          }}
          onClickDay={(day) => {
            console.log(day);
            setCurrentDay(day);
            setShowDay(true);
          }}
          navigationLabel={(curLabel) =>
            curLabel.label.charAt(0).toUpperCase() + curLabel.label.substring(1)
          }
          tileContent={({ activeStartDate, date, view }) =>
            view === "month" &&
            daysWithActivities.has(Moment(date).format("YYYY-MM-DD")) && (
              <div className="kalender_heart">
                <FaHeart />
              </div>
            )
          }
        />
      </div>
      {showDay && (
        <KalenderModal
          standjes={standjes}
          day={currentDay}
          actions={daysWithActivities.has(Moment(currentDay).format("YYYY-MM-DD")) ? retrieveDay(currentDay) : []}
          setShowDay={setShowDay}
        />
      )}
    </div>
  );
};









export default Kalender;
