import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './auth.entity';




@Entity('T01_imagen_usuario')
export class ImagenUsuario{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamp',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ManyToOne(
        ()=>Usuario,
        (usuario)=>usuario.imagenes,
        {onDelete:'CASCADE'}
    )
    usuario:Usuario
    
}