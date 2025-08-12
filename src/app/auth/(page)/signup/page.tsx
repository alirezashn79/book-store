import SignUpForm from '../../_components/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'This is Dashboard for bookStore',
}

export default function SignUp() {
  return <SignUpForm />
}
