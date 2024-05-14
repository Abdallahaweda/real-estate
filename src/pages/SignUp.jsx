import {Link} from 'react-router-dom'
export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="User Name" className="border rounded-lg p-3" id="username" />
        <input type="email" placeholder="Email" className="border rounded-lg p-3" id="email" />
        <input type="password" placeholder="Password" className="border rounded-lg p-3" id="password" />
        <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 uppercase disabled:placeholder-opacity-90">Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
        <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
