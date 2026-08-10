-- Seed the existing checked-in catalogue. Safe to re-run.
INSERT OR IGNORE INTO resources(id,title,description,subject,type,thumbnail,url,rating,status,featured,sort_order,published_at) VALUES
('1','Rabbit Intergers!','Learn how to add and subtract positive and negative integers.','Math','Worksheet','https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=687&auto=format&fit=crop','/integers/rabbit-integers.html',5,'published',1,10,CURRENT_TIMESTAMP),
('2','Letter Countdown','Guess the word before the timer runs out! A fun way to practice spelling and vocabulary.','Writing','Game','https://images.unsplash.com/photo-1637019837948-58c4c4eb8082?q=80&w=752&auto=format&fit=crop','/lettercountdown/lettercountdown.html',4.8,'published',1,20,CURRENT_TIMESTAMP),
('3','Digital Multiplication Table','A digital multiplication reference and practice tool.','Math','Website','https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600','/multiplication/',4.9,'published',1,30,CURRENT_TIMESTAMP),
('4','Headline','Create your own news headline and build a story while practising writing and creativity.','Writing','Website','https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=80&w=735&auto=format&fit=crop','/headline-to-story/',4.7,'published',1,40,CURRENT_TIMESTAMP),
('5','Story Symphony','Create a visual masterpiece by writing a short story.','Art','Website','https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&auto=format&fit=crop&q=60','/story-symphony/',4.9,'published',0,50,CURRENT_TIMESTAMP),
('6','RumbleRink','Use words to score points and win the championship!','Writing','Game','https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&q=80&w=600','/rumblerink/',4.6,'published',0,60,CURRENT_TIMESTAMP),
('7','Graduate Together','Learn skills and earn credits on your way to graduation.','Lifeskills','Game','https://images.unsplash.com/photo-1665567032056-4d22d92638da?auto=format&fit=crop&q=80&w=600','/graduate-together/',4.6,'published',0,70,CURRENT_TIMESTAMP),
('8','Pre-Calculus Lab','Explore parent functions, transformations, inverses, compositions, and operations with interactive graphs and a digital whiteboard.','Math','Website','https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600','/math/',5,'published',1,80,CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO resource_age_bands(resource_id,age_band) VALUES
('1','5-8'),('1','9-12'),('2','k4'),('2','5-8'),('3','k4'),('3','5-8'),('4','5-8'),('4','9-12'),
('5','k4'),('5','5-8'),('5','9-12'),('6','k4'),('6','5-8'),('7','5-8'),('7','9-12'),('8','9-12');
