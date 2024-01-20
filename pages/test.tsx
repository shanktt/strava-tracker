export default function Test() {
    return (
        <header className="flex items-center p-4 shadow-md">
        <div className="flex-grow text-center">
            <h1 className="text-xl font-semibold">Strava Tracker</h1>
        </div>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
    </header>
    )
}