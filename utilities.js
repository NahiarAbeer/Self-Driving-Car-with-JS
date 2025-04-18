function lerp(A,B, t){
    return A+(B-A)*t
}
function getInterSection(A,B,C,D){
    /*
        Ix = Ax +(Bx-Ax)t = Cx +(Dx-Cx)u
        Iy = Ay +(By-Ay)t = Cy +(Dy-Cy)u


         Ax +(Bx-Ax)t = Cx +(Dx-Cx)u
         (Ax-Cx) + (Bx-Ax)t = (Dx-Cx)u 

         (Ay-Cy) + (By-Ay)t = (Dy-Cy)u 
       =>(Dx-Cx)(Ay - Cy) +(Dx-Cx)(By-Ay)t = (Dx-Cx)(Dy - Cy)u  
       =>(Dx-Cx)(Ay - Cy) +(Dx-Cx)(By-Ay)t =(Dy - Cy){(Ax-Cx) + (Bx-Ax)t } 
        (Dx-Cx)(Ay - Cy) - (Dy-Cy)(Ax-Cx) =t{(Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)}

        top = (Dx-Cx)(Ay - Cy) - (Dy-Cy)(Ax-Cx)
        bottom =(Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)
        t = top/bottom
    */

    const tTop = (D.x-C.x)*(A.y - C.y) - (D.y-C.y)*(A.x-C.x)
    const uTop = (C.y - A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y)
    const bottom =(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y)
    if(bottom!=0){
        const t= tTop/bottom
        const u= uTop/bottom
        if(t>=0 && t<=1 && u>=0 && u<=1 ){
            return {
                x:lerp(
                    A.x , B.x , t
                ),
                y:lerp(
                    A.y , B.y , t
                ),
                offset:t
                
                }
            }
    }
    return null
}
function polysIntersect(poly1, poly2){
    for(let i=0; i< poly1.length; i++){
        for(let j=0; j<poly2.length; j++){
            const touch = getInterSection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true
            }
        }
    } 
    return false
}