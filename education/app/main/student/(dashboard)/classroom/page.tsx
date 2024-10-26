import React from 'react';
import FilePage from '@/components/Class';
import CourseExamForm from '@/components/ClassroomForm'

const App: React.FC = () => {
    return (
        <div>
            <CourseExamForm/>
            <FilePage />
        </div>
    );
};

export default App;
