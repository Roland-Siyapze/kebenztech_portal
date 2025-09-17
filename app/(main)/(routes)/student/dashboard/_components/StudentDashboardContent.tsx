// app/(main)/(routes)/student/dashboard/_components/StudentDashboardContent.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Avatar, 
  Button, 
  Progress, 
  Chip,
  Badge,
  Image,
  Divider
} from '@nextui-org/react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Calendar, 
  Star, 
  Play, 
  ChevronRight,
  BarChart3,
  Target,
  Trophy,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import { User, Course, Category, Chapter, Purchase, Attachment } from '@prisma/client';

interface CourseWithDetails extends Course {
  category: Category | null;
  chapters: Chapter[];
  purchases: Purchase[];
  attachments: Attachment[];
}

interface PurchaseWithCourse extends Purchase {
  course: Course & {
    category: Category | null;
  };
}

interface StudentDashboardContentProps {
  userData: User | null;
  purchasedCourses: CourseWithDetails[];
  allPurchases: PurchaseWithCourse[];
}

export const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  userData,
  purchasedCourses,
  allPurchases
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Activity', icon: <Clock className="w-4 h-4" /> },
    { name: 'Achievements', icon: <Trophy className="w-4 h-4" /> }
  ];

  // Calculate statistics from real data
  const totalCourses = purchasedCourses.length;
  const totalChapters = purchasedCourses.reduce((acc, course) => acc + course.chapters.length, 0);
  const totalAttachments = purchasedCourses.reduce((acc, course) => acc + course.attachments.length, 0);
  const totalSpent = allPurchases.reduce((acc, purchase) => acc + (purchase.course.price || 0), 0);

  // Get unique categories from purchased courses
  const uniqueCategories = Array.from(
    new Set(purchasedCourses.map(course => course.category?.name).filter(Boolean))
  );

  // Recent purchases (last 5)
  const recentPurchases = allPurchases.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.name
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {userData?.firstName || 'Student'}!
                </h1>
                <p className="text-purple-100 mb-6">
                  Ready to continue your learning journey?
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalCourses}</div>
                    <div className="text-purple-100 text-sm">Courses Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalChapters}</div>
                    <div className="text-purple-100 text-sm">Total Chapters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{uniqueCategories.length}</div>
                    <div className="text-purple-100 text-sm">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${totalSpent}</div>
                    <div className="text-purple-100 text-sm">Total Invested</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-8">
                <Avatar
                  src={userData?.imageUrl || undefined}
                  className="w-24 h-24 border-4 border-white/20"
                  name={userData?.firstName || "User"}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Progress Stats */}
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Learning Statistics</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalCourses}
                      </div>
                      <div className="text-sm text-gray-500">Courses Owned</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalChapters}
                      </div>
                      <div className="text-sm text-gray-500">Chapters Available</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalAttachments}
                      </div>
                      <div className="text-sm text-gray-500">Resources</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${totalSpent}
                      </div>
                      <div className="text-sm text-gray-500">Total Invested</div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Continue Learning - Your Purchased Courses */}
              <Card className="shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Continue Learning</h3>
                  <Button 
                    variant="light" 
                    size="sm" 
                    endContent={<ChevronRight className="w-4 h-4" />}
                    onClick={() => setActiveTab('My Courses')}
                  >
                    View all courses
                  </Button>
                </CardHeader>
                <CardBody className="space-y-6">
                  {purchasedCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No courses purchased yet
                      </h4>
                      <p className="text-gray-500 mb-4">Start your learning journey by purchasing your first course</p>
                      <Link href="/">
                        <Button color="primary">Browse Courses</Button>
                      </Link>
                    </div>
                  ) : (
                    purchasedCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <div className="flex gap-4">
                          <Image
                            src={course.imageUrl || "/default-course.jpg"}
                            alt={course.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <Chip size="sm" color="primary" variant="flat" className="mb-2">
                                  {course.category?.name || "General"}
                                </Chip>
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {course.chapters.length} chapters • {course.attachments.length} resources
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">
                                  ${course.price || 'Free'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                  {course.chapters.length > 0 
                                    ? `Start with: ${course.chapters[0]?.title}` 
                                    : "Ready to start"}
                                </p>
                              </div>
                              <Link href={`/course/${course.id}`}>
                                <Button
                                  color="primary"
                                  size="sm"
                                  startContent={<Play className="w-4 h-4" />}
                                >
                                  Start Learning
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Learning Categories */}
              <Card className="shadow-sm">
                <CardHeader className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Learning Categories</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  {uniqueCategories.length === 0 ? (
                    <p className="text-gray-500 text-sm">No categories yet</p>
                  ) : (
                    uniqueCategories.map((category, index) => {
                      const coursesInCategory = purchasedCourses.filter(
                        course => course.category?.name === category
                      ).length;
                      
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {coursesInCategory} course{coursesInCategory !== 1 ? 's' : ''}
                          </Chip>
                        </div>
                      );
                    })
                  )}
                </CardBody>
              </Card>

              {/* Recent Purchases */}
              <Card className="shadow-sm">
                <CardHeader className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Recent Purchases</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {recentPurchases.length === 0 ? (
                    <p className="text-gray-500 text-sm">No purchases yet</p>
                  ) : (
                    recentPurchases.map((purchase) => (
                      <div key={purchase.id} className="border-l-4 border-green-200 pl-4 py-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {purchase.course.title}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {purchase.course.category?.name || "General"}
                          </p>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs font-semibold text-green-600">
                              ${purchase.course.price || 'Free'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Link href="/">
                    <Button variant="flat" className="w-full justify-start" startContent={<BookOpen className="w-4 h-4" />}>
                      Browse More Courses
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="flat" className="w-full justify-start" startContent={<Users className="w-4 h-4" />}>
                      Account Settings
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* My Courses Tab - Full Course List */}
      {activeTab === 'My Courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Purchased Courses ({totalCourses})
            </h2>
            <Link href="/">
              <Button color="primary" startContent={<BookOpen className="w-4 h-4" />}>
                Browse More Courses
              </Button>
            </Link>
          </div>

          {purchasedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No courses purchased yet
              </h3>
              <p className="text-gray-500 mb-4">Start learning by purchasing your first course</p>
              <Link href="/">
                <Button color="primary">Explore Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="p-0">
                    <Image
                      src={course.imageUrl || "/default-course.jpg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <Chip size="sm" color="primary" variant="flat">
                          {course.category?.name || "General"}
                        </Chip>
                        <p className="text-sm font-semibold text-green-600">
                          ${course.price || 'Free'}
                        </p>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {course.description || "Start learning with this comprehensive course"}
                      </p>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{course.chapters.length} chapters</span>
                        <span>{course.attachments.length} resources</span>
                      </div>
                      
                      <Divider />
                      
                      <Link href={`/course/${course.id}`}>
                        <Button color="primary" className="w-full">
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'Activity' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Activity</h2>
          
          <Card className="shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold">Purchase History</h3>
            </CardHeader>
            <CardBody>
              {allPurchases.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Purchased: {purchase.course.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {purchase.course.category?.name || "General"} • 
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${purchase.course.price || 'Free'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'Achievements' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className={`shadow-sm ${totalCourses > 0 ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
              <CardBody className="text-center p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  totalCourses > 0 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  First Course
                </h3>
                <p className="text-sm text-gray-500 mb-4">Purchase your first course</p>
                {totalCourses > 0 ? (
                  <Chip color="success" variant="flat">Earned</Chip>
                ) : (
                  <Chip color="default" variant="flat">Not Earned</Chip>
                )}
              </CardBody>
            </Card>

            <Card className={`shadow-sm ${totalCourses >= 3 ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
              <CardBody className="text-center p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  totalCourses >= 3 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Course Collector
                </h3>
                <p className="text-sm text-gray-500 mb-4">Own 3 or more courses</p>
                {totalCourses >= 3 ? (
                  <Chip color="success" variant="flat">Earned</Chip>
                ) : (
                  <Chip color="default" variant="flat">{totalCourses}/3 courses</Chip>
                )}
              </CardBody>
            </Card>

            <Card className={`shadow-sm ${totalSpent >= 100 ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
              <CardBody className="text-center p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  totalSpent >= 100 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Investor
                </h3>
                <p className="text-sm text-gray-500 mb-4">Invest $100+ in learning</p>
                {totalSpent >= 100 ? (
                  <Chip color="success" variant="flat">Earned</Chip>
                ) : (
                  <Chip color="default" variant="flat">${totalSpent}/100</Chip>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};