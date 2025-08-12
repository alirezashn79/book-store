import SignInForm from '../../_components/SignInForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'This is Dashboard for bookStore',
}

export default function SignIn() {
  return <SignInForm />
}
