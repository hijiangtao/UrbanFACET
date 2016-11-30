
filename = 'matrix-1-in-20.csv';
[A,delimiterOut]=importdata(filename)

imagesc(A)
print -djpeg99 '1-in-20.jpg'
