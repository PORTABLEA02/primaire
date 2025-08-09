import React, { useState } from 'react';
import { X, Users, User, ArrowRight, CheckCircle, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAssignments: (assignments: Assignment[]) => void;
}

interface Teacher {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  currentClass: string | null;
  specializations: string[];
  performanceRating: number;
  isAvailable: boolean;
}

interface Class {
  id: string;
  name: string;
  level: string;
  students: number;
  capacity: number;
  currentTeacher: string | null;
  currentTeacherId: string | null;
  subjects: string[];
  needsTeacher: boolean;
}

interface Assignment {
  teacherId: string;
  classId: string;
  teacherName: string;
  className: string;
  isNewAssignment: boolean;
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSaveAssignments
}) => {
  // Données des enseignants
  const [teachers] = useState<Teacher[]>([
    {
      id: 'traore',
      name: 'M. Moussa Traore',
      qualification: 'Licence en Pédagogie',
      experience: '8 ans',
      currentClass: 'CI A',
      specializations: ['Mathématiques', 'Sciences'],
      performanceRating: 4.5,
      isAvailable: false
    },
    {
      id: 'kone',
      name: 'Mme Aminata Kone',
      qualification: 'CAP Petite Enfance',
      experience: '12 ans',
      currentClass: 'Maternelle 1A',
      specializations: ['Petite Enfance', 'Psychologie Enfantine'],
      performanceRating: 4.8,
      isAvailable: false
    },
    {
      id: 'sidibe',
      name: 'M. Ibrahim Sidibe',
      qualification: 'Licence en Lettres Modernes',
      experience: '5 ans',
      currentClass: 'CE2B',
      specializations: ['Littérature', 'Histoire'],
      performanceRating: 4.2,
      isAvailable: false
    },
    {
      id: 'coulibaly',
      name: 'Mlle Fatoumata Coulibaly',
      qualification: 'Licence en Sciences de l\'Éducation',
      experience: '3 ans',
      currentClass: null,
      specializations: ['Pédagogie', 'Psychologie'],
      performanceRating: 4.0,
      isAvailable: true
    },
    {
      id: 'sangare',
      name: 'M. Sekou Sangare',
      qualification: 'Maîtrise en Sciences Naturelles',
      experience: '15 ans',
      currentClass: null,
      specializations: ['Sciences Naturelles', 'Environnement'],
      performanceRating: 4.7,
      isAvailable: true
    },
    {
      id: 'diarra',
      name: 'M. Bakary Diarra',
      qualification: 'Licence en Mathématiques',
      experience: '6 ans',
      currentClass: null,
      specializations: ['Mathématiques', 'Physique'],
      performanceRating: 4.3,
      isAvailable: true
    },
    {
      id: 'keita',
      name: 'Mme Salimata Keita',
      qualification: 'Licence en Français',
      experience: '4 ans',
      currentClass: null,
      specializations: ['Français', 'Littérature'],
      performanceRating: 4.1,
      isAvailable: true
    }
  ]);

  // Données des classes
  const [classes] = useState<Class[]>([
    {
      id: 'maternelle-1a',
      name: 'Maternelle 1A',
      level: 'Maternelle',
      students: 25,
      capacity: 30,
      currentTeacher: 'Mme Aminata Kone',
      currentTeacherId: 'kone',
      subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs'],
      needsTeacher: false
    },
    {
      id: 'maternelle-1b',
      name: 'Maternelle 1B',
      level: 'Maternelle',
      students: 0,
      capacity: 30,
      currentTeacher: null,
      currentTeacherId: null,
      subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs'],
      needsTeacher: true
    },
    {
      id: 'ci-a',
      name: 'CI A',
      level: 'CI',
      students: 32,
      capacity: 35,
      currentTeacher: 'M. Moussa Traore',
      currentTeacherId: 'traore',
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique'],
      needsTeacher: false
    },
    {
      id: 'cp1',
      name: 'CP1',
      level: 'CP',
      students: 0,
      capacity: 35,
      currentTeacher: null,
      currentTeacherId: null,
      subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin'],
      needsTeacher: true
    },
    {
      id: 'ce2b',
      name: 'CE2B',
      level: 'CE2',
      students: 38,
      capacity: 40,
      currentTeacher: 'M. Ibrahim Sidibe',
      currentTeacherId: 'sidibe',
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique'],
      needsTeacher: false
    },
    {
      id: 'cm1a',
      name: 'CM1A',
      level: 'CM1',
      students: 35,
      capacity: 40,
      currentTeacher: null,
      currentTeacherId: null,
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais'],
      needsTeacher: true
    },
    {
      id: 'cm2a',
      name: 'CM2A',
      level: 'CM2',
      students: 42,
      capacity: 45,
      currentTeacher: null,
      currentTeacherId: null,
      subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais'],
      needsTeacher: true
    }
  ]);

  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'assign'>('overview');

  const availableTeachers = teachers.filter(t => t.isAvailable);
  const classesNeedingTeacher = classes.filter(c => c.needsTeacher);
  const assignedClasses = classes.filter(c => !c.needsTeacher);

  const createAssignment = () => {
    if (selectedTeacher && selectedClass) {
      const teacher = teachers.find(t => t.id === selectedTeacher);
      const classInfo = classes.find(c => c.id === selectedClass);
      
      if (teacher && classInfo) {
        const newAssignment: Assignment = {
          teacherId: selectedTeacher,
          classId: selectedClass,
          teacherName: teacher.name,
          className: classInfo.name,
          isNewAssignment: true
        };
        
        setPendingAssignments(prev => [...prev, newAssignment]);
        setSelectedTeacher(null);
        setSelectedClass(null);
      }
    }
  };

  const removeAssignment = (assignmentIndex: number) => {
    setPendingAssignments(prev => prev.filter((_, index) => index !== assignmentIndex));
  };

  const handleSave = () => {
    if (pendingAssignments.length > 0) {
      onSaveAssignments(pendingAssignments);
      setPendingAssignments([]);
      onClose();
    }
  };

  const getTeacherCompatibility = (teacher: Teacher, classInfo: Class) => {
    let score = 0;
    let reasons = [];

    // Vérifier les spécialisations
    if (classInfo.level === 'Maternelle' && teacher.specializations.includes('Petite Enfance')) {
      score += 30;
      reasons.push('Spécialisé en petite enfance');
    }
    
    if (teacher.specializations.includes('Mathématiques') && classInfo.subjects.includes('Mathématiques')) {
      score += 20;
      reasons.push('Spécialisé en mathématiques');
    }
    
    if (teacher.specializations.includes('Sciences Naturelles') && classInfo.subjects.includes('Sciences')) {
      score += 20;
      reasons.push('Spécialisé en sciences');
    }

    // Expérience
    const experienceYears = parseInt(teacher.experience.split(' ')[0]) || 0;
    if (experienceYears >= 10) {
      score += 25;
      reasons.push('Très expérimenté');
    } else if (experienceYears >= 5) {
      score += 15;
      reasons.push('Expérimenté');
    }

    // Performance
    if (teacher.performanceRating >= 4.5) {
      score += 25;
      reasons.push('Excellente performance');
    } else if (teacher.performanceRating >= 4.0) {
      score += 15;
      reasons.push('Bonne performance');
    }

    return { score: Math.min(score, 100), reasons };
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestion des Affectations</h2>
                <p className="text-gray-600">Système d'enseignant unique - Affectation par classe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center mt-6 space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'overview' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Vue d'Ensemble
              </button>
              <button
                onClick={() => setViewMode('assign')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'assign' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Nouvelle Affectation
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Classes sans Enseignant</p>
                  <p className="text-2xl font-bold text-red-600">{classesNeedingTeacher.length}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Enseignants Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{availableTeachers.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Classes Assignées</p>
                  <p className="text-2xl font-bold text-blue-600">{assignedClasses.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Affectations en Attente</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingAssignments.length}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'overview' && (
            <div className="space-y-8">
              {/* Classes sans enseignant */}
              {classesNeedingTeacher.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Classes sans Enseignant ({classesNeedingTeacher.length})</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classesNeedingTeacher.map((classInfo) => (
                      <div key={classInfo.id} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-red-800">{classInfo.name}</h4>
                            <p className="text-sm text-red-600">{classInfo.level}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-red-600">{classInfo.students} élèves</p>
                            <p className="text-xs text-red-500">Capacité: {classInfo.capacity}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-xs text-red-600 mb-1">Matières à enseigner:</p>
                          <div className="flex flex-wrap gap-1">
                            {classInfo.subjects.slice(0, 3).map(subject => (
                              <span key={subject} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                {subject}
                              </span>
                            ))}
                            {classInfo.subjects.length > 3 && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                +{classInfo.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedClass(classInfo.id);
                            setViewMode('assign');
                          }}
                          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Assigner Enseignant
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes avec enseignant */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Classes avec Enseignant ({assignedClasses.length})</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedClasses.map((classInfo) => {
                    const teacher = teachers.find(t => t.id === classInfo.currentTeacherId);
                    
                    return (
                      <div key={classInfo.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-green-800">{classInfo.name}</h4>
                            <p className="text-sm text-green-600">{classInfo.level}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-600">{classInfo.students} élèves</p>
                            <p className="text-xs text-green-500">Capacité: {classInfo.capacity}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3 p-3 bg-white rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">
                                {teacher?.name.split(' ')[1]?.[0]}{teacher?.name.split(' ')[2]?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{classInfo.currentTeacher}</p>
                              <p className="text-xs text-gray-500">{teacher?.qualification}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Performance:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(teacher?.performanceRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{teacher?.performanceRating}/5</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedClass(classInfo.id);
                            setViewMode('assign');
                          }}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Changer Enseignant
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enseignants disponibles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Enseignants Disponibles ({availableTeachers.length})</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTeachers.map((teacher) => (
                    <div key={teacher.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {teacher.name.split(' ')[1]?.[0]}{teacher.name.split(' ')[2]?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800">{teacher.name}</h4>
                          <p className="text-sm text-blue-600">{teacher.qualification}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Expérience:</strong> {teacher.experience}</p>
                        <p><strong>Performance:</strong> {teacher.performanceRating}/5</p>
                        <div>
                          <p><strong>Spécialisations:</strong></p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {teacher.specializations.map(spec => (
                              <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher.id);
                          setViewMode('assign');
                        }}
                        className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Assigner à une Classe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'assign' && (
            <div className="space-y-8">
              {/* Interface d'affectation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sélection enseignant */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sélectionner un Enseignant</h3>
                  
                  <div className="space-y-3">
                    {availableTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        onClick={() => setSelectedTeacher(teacher.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedTeacher === teacher.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {teacher.name.split(' ')[1]?.[0]}{teacher.name.split(' ')[2]?.[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{teacher.name}</h4>
                            <p className="text-sm text-gray-600">{teacher.qualification}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">Performance:</span>
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-xs ${i < Math.floor(teacher.performanceRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sélection classe */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sélectionner une Classe</h3>
                  
                  <div className="space-y-3">
                    {classes.map((classInfo) => {
                      const teacher = selectedTeacher ? teachers.find(t => t.id === selectedTeacher) : null;
                      const compatibility = teacher ? getTeacherCompatibility(teacher, classInfo) : null;
                      
                      return (
                        <div
                          key={classInfo.id}
                          onClick={() => setSelectedClass(classInfo.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedClass === classInfo.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-800">{classInfo.name}</h4>
                              <p className="text-sm text-gray-600">{classInfo.level} • {classInfo.students} élèves</p>
                            </div>
                            
                            <div className="text-right">
                              {classInfo.currentTeacher ? (
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{classInfo.currentTeacher}</p>
                                  <p className="text-xs text-gray-500">Enseignant actuel</p>
                                </div>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  Sans enseignant
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {compatibility && (
                            <div className="mt-3 p-2 bg-white rounded border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Compatibilité:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getCompatibilityColor(compatibility.score)}`}>
                                  {getCompatibilityLabel(compatibility.score)} ({compatibility.score}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full ${
                                    compatibility.score >= 80 ? 'bg-green-500' :
                                    compatibility.score >= 60 ? 'bg-blue-500' :
                                    compatibility.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${compatibility.score}%` }}
                                ></div>
                              </div>
                              {compatibility.reasons.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {compatibility.reasons.slice(0, 2).join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Affectation en cours */}
              {selectedTeacher && selectedClass && (
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Nouvelle Affectation</h3>
                  
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="font-medium text-blue-800">
                        {teachers.find(t => t.id === selectedTeacher)?.name}
                      </p>
                      <p className="text-sm text-blue-600">
                        {teachers.find(t => t.id === selectedTeacher)?.qualification}
                      </p>
                    </div>
                    
                    <ArrowRight className="h-8 w-8 text-blue-600" />
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="font-medium text-purple-800">
                        {classes.find(c => c.id === selectedClass)?.name}
                      </p>
                      <p className="text-sm text-purple-600">
                        {classes.find(c => c.id === selectedClass)?.level}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedTeacher(null);
                        setSelectedClass(null);
                      }}
                      className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={createAssignment}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirmer l'Affectation
                    </button>
                  </div>
                </div>
              )}

              {/* Affectations en attente */}
              {pendingAssignments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-orange-600" />
                    <span>Affectations en Attente ({pendingAssignments.length})</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {pendingAssignments.map((assignment, index) => (
                      <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">{assignment.teacherName}</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-orange-600" />
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">{assignment.className}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeAssignment(index)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'assign' && (
            <div className="space-y-6">
              <button
                onClick={() => setViewMode('overview')}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Retour à la vue d'ensemble
              </button>
              
              {/* Interface d'affectation détaillée */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Liste des enseignants avec compatibilité */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Enseignants Disponibles</h3>
                  
                  <div className="space-y-4">
                    {availableTeachers.map((teacher) => {
                      const classInfo = selectedClass ? classes.find(c => c.id === selectedClass) : null;
                      const compatibility = classInfo ? getTeacherCompatibility(teacher, classInfo) : null;
                      
                      return (
                        <div
                          key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTeacher === teacher.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {teacher.name.split(' ')[1]?.[0]}{teacher.name.split(' ')[2]?.[0]}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{teacher.name}</h4>
                                <p className="text-sm text-gray-600">{teacher.qualification}</p>
                                <p className="text-sm text-gray-500">{teacher.experience}</p>
                              </div>
                            </div>
                            
                            {compatibility && (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCompatibilityColor(compatibility.score)}`}>
                                {getCompatibilityLabel(compatibility.score)}
                              </span>
                            )}
                          </div>
                          
                          {compatibility && (
                            <div className="space-y-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    compatibility.score >= 80 ? 'bg-green-500' :
                                    compatibility.score >= 60 ? 'bg-blue-500' :
                                    compatibility.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${compatibility.score}%` }}
                                ></div>
                              </div>
                              
                              {compatibility.reasons.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  <p className="font-medium mb-1">Avantages:</p>
                                  <ul className="space-y-1">
                                    {compatibility.reasons.map((reason, index) => (
                                      <li key={index}>• {reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Liste des classes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Classes Disponibles</h3>
                  
                  <div className="space-y-4">
                    {classes.map((classInfo) => (
                      <div
                        key={classInfo.id}
                        onClick={() => setSelectedClass(classInfo.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedClass === classInfo.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : classInfo.needsTeacher
                              ? 'border-red-200 bg-red-50 hover:border-red-300'
                              : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-800">{classInfo.name}</h4>
                            <p className="text-sm text-gray-600">{classInfo.level} • {classInfo.students} élèves</p>
                          </div>
                          
                          <div className="text-right">
                            {classInfo.currentTeacher ? (
                              <div>
                                <p className="text-sm font-medium text-gray-800">{classInfo.currentTeacher}</p>
                                <p className="text-xs text-gray-500">Enseignant actuel</p>
                              </div>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                Sans enseignant
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <p className="mb-1">Matières: {classInfo.subjects.length}</p>
                          <div className="flex flex-wrap gap-1">
                            {classInfo.subjects.slice(0, 4).map(subject => (
                              <span key={subject} className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {subject}
                              </span>
                            ))}
                            {classInfo.subjects.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                +{classInfo.subjects.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirmation d'affectation */}
              {selectedTeacher && selectedClass && (
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Confirmer l'Affectation</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Enseignant Sélectionné</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Nom:</strong> {teachers.find(t => t.id === selectedTeacher)?.name}</p>
                        <p><strong>Qualification:</strong> {teachers.find(t => t.id === selectedTeacher)?.qualification}</p>
                        <p><strong>Expérience:</strong> {teachers.find(t => t.id === selectedTeacher)?.experience}</p>
                        <p><strong>Performance:</strong> {teachers.find(t => t.id === selectedTeacher)?.performanceRating}/5</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Classe Sélectionnée</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Classe:</strong> {classes.find(c => c.id === selectedClass)?.name}</p>
                        <p><strong>Niveau:</strong> {classes.find(c => c.id === selectedClass)?.level}</p>
                        <p><strong>Élèves:</strong> {classes.find(c => c.id === selectedClass)?.students}</p>
                        <p><strong>Matières:</strong> {classes.find(c => c.id === selectedClass)?.subjects.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedTeacher(null);
                        setSelectedClass(null);
                      }}
                      className="px-4 py-2 border border-green-300 rounded-lg hover:bg-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={createAssignment}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirmer l'Affectation
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {pendingAssignments.length > 0 && (
                <span>{pendingAssignments.length} affectation(s) en attente de sauvegarde</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              
              {pendingAssignments.length > 0 && (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Sauvegarder les Affectations</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TeacherAssignmentModal;