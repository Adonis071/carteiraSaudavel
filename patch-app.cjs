const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';`,
  `import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';`
);

code = code.replace(
  `import { ThemeProvider } from './context/ThemeContext';`,
  `import { ThemeProvider } from './context/ThemeContext';\nimport { AnimatePresence, motion } from 'motion/react';`
);

const oldAppRoutes = `function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}`;

const newAppRoutes = `function AppRoutes() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  if (!currentUser) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="*" element={
            <motion.div {...pageTransition}>
              <Auth />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div {...pageTransition} className="w-full">
              <Dashboard />
            </motion.div>
          } />
          <Route path="/transactions" element={
            <motion.div {...pageTransition} className="w-full">
              <Transactions />
            </motion.div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}`;

if(code.includes(oldAppRoutes)) {
    code = code.replace(oldAppRoutes, newAppRoutes);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find oldAppRoutes");
}
