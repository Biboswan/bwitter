import { Suspense } from 'react';

const Spinner = () => <div>loading...</div>;

const LoadingBoundary = ({ children }) => <Suspense fallback={<Spinner />}>{children}</Suspense>;
// typeof window !== 'undefined' ? (
//     <Suspense fallback={<Spinner />}>{children}</Suspense>
// ) : (
//     children
// );

export default LoadingBoundary;
